<template>
    <div>
        <ul>
            <v-container>
                <v-card hover class="mx-auto"
                v-for="(event, index) in events" :key="index">
                {{ event }}
                    <v-card-title class="justify-center">{{ event.companyName }}</v-card-title>
                    <v-card-subtitle>{{ event.name }}</v-card-subtitle>
                    <v-card-text>{{ event.details }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn>Edit (work in progress)</v-btn>
                        <v-btn @click="deleteEvent(event)">Delete</v-btn>
                        <v-btn>Share (work in progress)</v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-card>
            </v-container>
        </ul>
    </div>
</template>


<script>
import { db } from '@/main';
import { mapGetters } from "vuex";
import { mapState } from 'vuex';


export default {

    name: "list",
    data: () => ({
        events: [],
        selectedEvent: {}
    }),

    mounted() {
        this.getEvents();
    },

    computed: {

    ...mapState(['userid'])

  },
    methods: {
        async getEvents() {
            let snapshot = await db.collection('testingWebApp').get();
            let events = [];

            console.log("getEvents() called");

            snapshot.forEach(doc => {
                // console.log(doc.data());

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

        async deleteEvent(ev){
            console.log("Deleting event... ");
            console.log(ev.id);

            await db.collection('testingWebApp').doc(ev.id).delete()

            this.getEvents();
        },
    }
}
</script>

<style scoped>

</style>