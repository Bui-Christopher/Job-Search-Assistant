<template>
  <v-main>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >

          <v-btn
              class="mr-4"
              color="Primary"
              @click="dialog = true"
              dark
          >
              New Event
            </v-btn>

            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
              class="mr-4"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>

          <!-- ADD EVENT DIALOG -->
          <v-dialog v-model="dialog" max-width="500">
              <v-card>
                  <v-container>
                      <v-form @submit.prevent="addEvent">
                          <v-text-field v-model="companyName" type="text" label="company name (required)"></v-text-field>
                          <v-text-field v-model="name" type="text" label="event name (required)"></v-text-field>
                          <v-text-field v-model="details" type="text" label="detail"></v-text-field>
                          <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
                          <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
                          <v-text-field v-model="startTime" type="time" label="start time"></v-text-field>
                          <v-text-field v-model="endTime" type="time" label="end time"></v-text-field>
                          <v-text-field v-model="color" type="color" label="color (click to open color menu)"></v-text-field>

                          <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">
                              create event
                          </v-btn>
                      </v-form>
                  </v-container>
              </v-card>
          </v-dialog>

        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"  
            color="dark"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          >
          <!-- the events at the top (all-day) -->
          <template v-slot:dayHeader="{ start }">
            <template v-for="event in events[start]">
              <!-- all day events don't have time -->
              <div
                v-if="!event.startTime"
                :key="event.title"
                class="my-event"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:dayBody="{ start, timeToY, minutesToPixels }">
            <template v-for="event in events[start]">
              <!-- timed events -->
              <div
                v-if="event.startTime"
                :key="event.title"
                :style="{ top: timeToY(event.startTime) + 'px', height: minutesToPixels(event.duration) + 'px' }"
                class="my-event with-time"
                @click="open(event)"
                v-html="event.title"
              ></div>
            </template>
          </template>
          </v-calendar>

          <!-- This is the popup section (when an event is clicked) -->
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>

              <!-- The video deleted this section but may prove useful later on so I am keeping it for now -->
              <!-- It does not have any functionality right now -->

              <!-- 
                  <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn> 
              -->
              </v-toolbar>

              <v-card-text>
                <!-- <span v-html="selectedEvent.details"></span> -->
                  <form v-if="currentlyEditing !== selectedEvent.id"> 
                      {{selectedEvent.details}} 
                  </form>

                  <form v-else > 
                      <textarea-autosize
                          v-model="selectedEvent.details"
                          type="text"
                          style="width: 100%"
                          :min-height="100"
                          placeholder="add note"
                      >
                      </textarea-autosize>
                  </form>
              </v-card-text>
              
              <!-- Close button for the popup event -->
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Close
                </v-btn>

              <!-- Edit button for the popup event -->
                <v-btn
                  text
                  v-if="currentlyEditing !== selectedEvent.id"
                  @click.prevent="editEvent(selectedEvent)"
                >
                  Edit
                </v-btn>

                
              <!-- Save button for the popup event -->
                <v-btn
                  text
                  v-else
                  @click.prevent="updateEvent(selectedEvent)"
                >
                  Save
                </v-btn>

              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>

import { db } from '@/main';
import { mapGetters } from "vuex";
import { mapState } from 'vuex';

export default {
    name: "calendar",
    components: {},
    data: () => ({
        // userid: null,

        today: new Date().toISOString().substring(0, 10),
        focus: new Date().toISOString().substring(0, 10),
        type: "month",
        typeToLabel: {
            month: "Month",
            week: "Week",
            day: "Day",
            "4day": "4 Days"
        },

        //This is all firebase stuff
        name: null,
        companyName: null,
        details: null, 
        start: null,
        end: null, 
        startTime: null,
        endTime: null, 
        color: "#1976d2",

        currentlyEditing: null,     // This is where the ID of the current event will go
        selectedEvent: {},      
        selectedElement: null,      // This is the DOM element ? What ever that means
        selectedOpen: false,        // This is if the event that you clicked on is 'open'
        events: [],                 // array of events that we are fetching from firebase
        dialog: false               // the new event modal or dialog popup.
    }),

    mounted() {
        this.getEvents();
        // this.$refs.calendar.scrollToTime('08:00');
    },

    computed: {
    // mapState([
    //   'userid'
    // ]),
    // {
    // // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user"
    }),
    ...mapState(['userid'])

  },

    methods: {
        async getEvents() {
            let snapshot = await db.collection('testingWebApp').get();
            let events = [];

            console.log("getEvents() called");

            snapshot.forEach(doc => {
                //console.log(doc.data());

                console.log("Doc user id : ", doc.data().userid);
                console.log("user id : ", this.$store.state.userid);

                if (this.userid == doc.data().userid) {
                  let appData = doc.data();
                  appData.id = doc.id;
                  events.push(appData);
                }
            });

            this.events = events;
        },

        async addEvent(){
            if(this.name && this.start && this.end && this.companyName){
                await db.collection('testingWebApp').add({
                    name: this.name,
                    companyName: this.companyName,
                    details: this.details,
                    start: this.start,
                    end: this.end,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    color: this.color,
                    userid: this.userid
                });
                this.getEvents();
                this.name = "";
                this.companyName = "";
                this.details = "";
                this.start = "";
                this.end = "";
                this.startTime = "";
                this.endTime = "";
                this.color = "#1976d2";
            }
            else{
                alert('Name, company name, start and end date are required')
            }

            this.selectedOpen = false;
            this.currentlyEditing = null;
        },

        async updateEvent(ev){
            await db.collection('testingWebApp').doc(this.currentlyEditing).update({
                details: ev.details
            })

            this.selectedOpen = false;
            this.currentlyEditing = null;
        },

        async deleteEvent(ev){
            await db.collection('testingWebApp').doc(ev).delete()

            this.selectedOpen = false;
            this.getEvents();
        },

        viewDay ({ date }) {
          // this.$refs.calendar.scrollToTime('08:00')
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },

    editEvent(ev){
        this.currentlyEditing = ev.id;
    },

      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      }
    }
};
</script>

