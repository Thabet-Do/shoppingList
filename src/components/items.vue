<template>
    <div>
        <!--Search By Name-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="searchShow ? myColor.main : 'dark' "
                        @click="searchShow = !searchShow"
                        class="mt-2 mr-2" dark small
                        v-on="on">
                    <v-icon :color="myColor.theme" small>fa-search</v-icon>
                </v-btn>
            </template>
            <span>Search</span>
        </v-tooltip>

        <!--Expand Details-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="expand ? myColor.main : 'dark'"
                        @click="expand = !expand"
                        class="mt-2 mr-2" dark small
                        v-on="on">
                    <v-icon :color="myColor.theme" small>fa-expand-arrows-alt</v-icon>
                </v-btn>
            </template>
            <span>Expand Details</span>
        </v-tooltip>

        <!--is Complete-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="filter.complete ? 'green' : 'dark' "
                        @click="filter.complete = !filter.complete"
                        class="mt-2 mr-2" dark small
                        v-on="on">
                    <v-icon :color="myColor.theme" small>fa-check</v-icon>
                </v-btn>
            </template>
            <span>Is Complete</span>
        </v-tooltip>

        <!--Add Item-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn @click.stop="dialogAddItem.dialog = true" class="mt-2 mr-2" color="orange" dark small
                       v-on="on">
                    <v-icon :color="myColor.theme" small>fa-cart-arrow-down</v-icon>
                </v-btn>
            </template>
            <span>Add New Order</span>
        </v-tooltip>

        <!-- Add Item Dialog -->
        <v-dialog v-model="dialogAddItem.dialog">
            <v-card>
                <v-card-title class="headline">Add New Order:</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field :rules="rules" dense hide-details="auto" label="Name" outlined/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field :rules="rules" dense hide-details="auto" label="Quantity" outlined/>
                        </v-col>
                        <v-col cols="6" v-show="dialogAddItem.simple">
                            <v-text-field :rules="rules" dense hide-details="auto" label="Unit" outlined/>
                        </v-col>
                        <v-col cols="6" v-show="dialogAddItem.simple">
                            <v-select :items="['On','Off']" :rules="rules" dense hide-details="auto" label="importance"
                                      outlined value="Off"/>
                        </v-col>
                        <v-col cols="12" v-show="dialogAddItem.simple">
                            <v-text-field :rules="rules" dense hide-details="auto" label="Price" outlined/>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea :rules="rules" dense hide-details="auto" label="Description" outlined rows="2"/>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn @click="dialogAddItem.simple = !dialogAddItem.simple" class="mx-2" color="green darken-1"
                           text>
                        {{dialogAddItem.simple ? 'Simple' : 'Advance'}}
                    </v-btn>
                    <v-spacer/>
                    <v-btn @click="dialogAddItem.dialog = false" color="green darken-1" text>
                        Close
                    </v-btn>

                    <v-btn @click="dialogAddItem.dialog = false" color="green darken-1" text>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Search By Name Input-->
        <v-text-field :class="searchShow ? 'fadeInRight' : 'fadeOutRight d-none'" class="mt-2 animated fast" dense
                      hide-details placeholder="Search"
                      solo v-model="filter.name"/>

        <!--Cards Loop-->
        <v-card :class="item.complete ? 'complete' : ''"
                :key="item.date"
                class="mx-auto my-3" outlined
                v-for="item in filteredItems">

            <v-row class="px-2 ma-0" justify="space-between">
                <v-col class="py-2">
                    <v-card-title class="pa-0">
                        <v-avatar :color="item.importance ? 'pink' : 'indigo'" class="mx-2" size="17"/>

                        {{item.name}}:
                        <transition name="fade">
                            <span style="font-weight: normal; font-size: 1rem" v-show="!expand"> {{item.quantity + item.unit}}</span>
                        </transition>
                    </v-card-title>
                </v-col>

                <div class="my-auto">
                    <v-btn :color="myColor.main" small value="1">
                        <v-icon :color="myColor.theme" small>fa-edit</v-icon>
                    </v-btn>
                    <v-btn
                            :color="item.complete ? 'green' : 'dark' "
                            @click="[item.complete = !item.complete, sendCompleteStatus(item.id, item.complete)]"
                            class="ml-1" dark
                            small>
                        <v-icon :color="myColor.theme" small>fa-check</v-icon>
                    </v-btn>
                </div>

                <transition name="fade">
                    <v-col class=" v-card__subtitle pt-0" cols="12" v-show="expand">
                        <v-row class="py-0" justify="space-between">
                            <v-col class="py-0">
                                Quantity: {{item.quantity}} {{item.unit}}
                            </v-col>
                            <v-col class="py-0">
                                Price: {{item.price}}
                            </v-col>
                            <v-col cols="12" v-if="item.description">Description: {{item.description}}</v-col>
                        </v-row>
                    </v-col>
                </transition>
            </v-row>
            <transition name="fade">
                <v-sheet :color="`${myColor.second} lighten-3`" class="text-center" tile v-show="expand">
                    <v-row dense>
                        <v-col class="pa-0 title grey--text font-weight-regular text--darken-2"
                               v-text="`modified: ${item.dateModify}`"/>
                        <v-col class="pa-0 title grey--text font-weight-regular text--darken-2"
                               v-text="`Created: ${item.dateCreate}`"/>
                    </v-row>
                </v-sheet>
            </transition>
        </v-card>
    </div>
</template>

<script>
    import moment from "moment";

    moment.locale('ar-kw');
    export default {
        name: "items",
        data: () => ({
            dialogAddItem: {
                dialog: false,
                simple: false
            },
            searchShow: 0,
            myColor: {
                main: 'indigo',
                theme: "white",
                second: "grey"
            },
            expand: false,
            items: [
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                    importance: true,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                    importance: true,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                    importance: true,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/20/1",
                    dateModify: "2019/20/1",
                    description: "XXXX",
                    complete: true,
                },
            ],
            filter: {
                name: '', /* All case --- false --- contain "name" */
                date: false, /*All case --- false --- range: "2020/1/20 - 2020/1/23" --- this day --- this month*/
                complete: {
                    active: false,
                    condition: true
                }, /*All case --- false --- true*/
                price: false, /*"<55"*/ /* All Case --- false = without filter price --- less than x '<x' --- More than x '>x' --- equal x '=x' */
                quantity: false, /*"<5000"*/ /* All Case --- false = without filter price --- less than x '<x' --- More than x '>x' --- equal x '=x' */
            }
        }),
        methods: {
            sendCompleteStatus: function (id, complete) {
                console.log("Complete State is Changed ID:", id, complete)
            }
        },
        computed: {
            filteredItems: function () {
                let items = this.items;
                let f = this.filter;
                if (f.complete) {
                    items = items.filter(item => item.complete);
                    console.log("Done Filter Complete");
                }
                if (f.quantity) {
                    const
                        quantityCond = f.quantity[0],
                        fQuantity = parseFloat(f.quantity.slice(1));
                    if (quantityCond === "<")
                        items = items.filter(i => parseFloat(i.quantity) >= fQuantity);
                    else if (quantityCond === ">")
                        items = items.filter(i => parseFloat(i.quantity) <= fQuantity);
                    else if (quantityCond === "=")
                        items = items.filter(i => parseFloat(i.quantity) === fQuantity);
                    console.log("Done Filter Quantity");
                }
                if (f.price) {
                    const
                        priceCond = f.price[0],
                        fPrice = parseFloat(f.price.slice(1));
                    if (priceCond === "<")
                        items = items.filter(i => parseFloat(i.price) >= fPrice);
                    else if (priceCond === ">")
                        items = items.filter(i => parseFloat(i.price) <= fPrice);
                    else if (priceCond === "=")
                        items = items.filter(i => parseFloat(i.price) === fPrice);
                    console.log("Done Filter Price");
                }
                if (f.name) {
                    items = items.filter(i => i.name.includes(f.name));
                    console.log("Done Filter Name");
                }
                if (f.date) {
                    const
                        date = f.date.split("-"),
                        startDate = date[0],
                        endDate = date[1];
                    console.log(startDate, endDate);
                    console.log("Done filter Date");
                }
                return items
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "items";
</style>