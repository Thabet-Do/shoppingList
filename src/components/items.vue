<template>
    <div>
        <!--Search By Name-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="!searchShow ? myColor.main : `${myColor.main} accent-2` "
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
                        :color="!expand ? myColor.deepPurple +' darken-1' : `${myColor.main} accent-2`"
                        @click="expand = !expand"
                        class="mt-2 mr-2" small
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
                        :color="filter.complete ? myColor.green : myColor.dark "
                        @click="filter.complete = !filter.complete"
                        class="mt-2 mr-2" dark small
                        v-on="on">
                    <v-icon :color="myColor.theme" small>fa-check</v-icon>
                </v-btn>
            </template>
            <span>{{ filter.complete ? 'Show Uncompleted' : 'Hide Uncompleted'}}</span>
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
                            <v-text-field dense hide-details="auto" label="Name" outlined
                                          v-model="newItem.name"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field dense hide-details="auto" label="Quantity"
                                          outlined v-model="newItem.quantity"/>
                        </v-col>
                        <v-col cols="6" v-show="dialogAddItem.simple">
                            <v-text-field dense hide-details="auto" label="Unit" outlined
                                          v-model="newItem.unit"/>
                        </v-col>
                        <v-col cols="6" v-show="dialogAddItem.simple">
                            <v-select :items="['On','Off']" dense hide-details="auto"
                                      label="importance" outlined
                                      v-model="newItem.importance" value="Off"/>
                        </v-col>
                        <v-col cols="12" v-show="dialogAddItem.simple">
                            <v-text-field dense hide-details="auto" label="Price" outlined
                                          v-model="newItem.price"/>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea dense hide-details="auto" label="Description"
                                        outlined rows="2" v-model="newItem.description"/>
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

                    <v-btn @click="addNewItem()" color="green darken-1" text>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- Edit Item Dialog -->
        <v-dialog v-model="dialogEditItem.dialog">
            <v-card>
                <v-card-title class="headline">Edit Order:</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field dense hide-details="auto" label="Name" outlined
                                          v-model="editItem.name"/>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field dense hide-details="auto" label="Quantity"
                                          outlined v-model="editItem.quantity"/>
                        </v-col>
                        <v-col cols="6" v-show="dialogEditItem.simple">
                            <v-text-field dense hide-details="auto" label="Unit" outlined
                                          v-model="editItem.unit"/>
                        </v-col>
                        <v-col cols="6" v-show="dialogEditItem.simple">
                            <v-select :items="['On','Off']" dense hide-details="auto"
                                      label="importance" outlined
                                      v-model="editItem.importance" value="Off"/>
                        </v-col>
                        <v-col cols="12" v-show="dialogEditItem.simple">
                            <v-text-field dense hide-details="auto" label="Price" outlined
                                          v-model="editItem.price"/>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea dense hide-details="auto" label="Description"
                                        outlined rows="2" v-model="editItem.description"/>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn @click="dialogEditItem.simple = !dialogEditItem.simple" class="mx-2" color="green darken-1"
                           text>
                        {{dialogEditItem.simple ? 'Simple' : 'Advance'}}
                    </v-btn>
                    <v-spacer/>
                    <v-btn @click="dialogEditItem.dialog = false" color="green darken-1" text>
                        Close
                    </v-btn>

                    <v-btn @click="updateItem()" color="green darken-1" text>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--More Option-->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="!moreOption ? 'blue-grey' : 'indigo accent-2'"
                        @click="moreOption = !moreOption"
                        class="mt-2 mr-2" dark small
                        v-on="on">
                    <v-icon :color="myColor.theme" small>{{moreOption ? 'fa-chevron-left' : 'fa-chevron-right'}}
                    </v-icon>
                </v-btn>
            </template>
            <span>{{moreOption ? 'Less Option' : 'More Option'}}</span>
        </v-tooltip>

        <!--Show Importance-->
        <v-tooltip top v-show="moreOption">
            <template v-slot:activator="{ on }">
                <v-btn
                        :color="!filter.importance ? 'indigo accent-2' : 'red'"
                        @click="filter.importance = ! filter.importance"
                        class="mt-2 mr-2"
                        dark small v-on="on"
                        v-show="moreOption">
                    <v-icon :color="myColor.theme" small>fa-fire</v-icon>
                </v-btn>
            </template>
            <span>{{ filter.importance ? 'Hide Importance' : 'Show Importance'}}</span>
        </v-tooltip>

        <!--Filter By Date-->
        <v-menu
                :close-on-content-click="false"
                offset-y
                ref="filter.date.menu"
                transition="scale-transition"
                v-model="filter.date.menu">
            <template v-slot:activator="{ on }">
                <v-btn
                        class="mt-2 mr-2"
                        color="indigo accent-2"
                        dark small v-on="on"
                        v-show="moreOption">
                    <v-icon :color="myColor.theme" small>fa-calendar-alt</v-icon>
                </v-btn>
            </template>
            <v-date-picker no-title range v-model="filter.date.dates">
                <v-spacer/>
                <v-btn :color="filter.date.cond ? 'green' : 'primary'" @click="filter.date.cond = !filter.date.cond"
                       outlined text>Active
                </v-btn>
                <v-btn @click="filter.date.menu = false" color="primary" text>OK</v-btn>
            </v-date-picker>
        </v-menu>

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
                        <v-avatar
                                :color="item.importance ? myColor.pink : myColor.main"
                                @click="[item.importance = !item.importance, sendImportanceStatus(item._id, item.importance)]"
                                class="mx-2 mouse-pointer" size="17"/>
                        {{item.name}}:
                        <transition name="fade">
                            <span style="font-weight: normal; font-size: 1rem" v-show="!expand"> {{item.quantity + item.unit}}</span>
                        </transition>
                    </v-card-title>
                </v-col>

                <div class="my-auto">
                    <v-btn :color="myColor.main" @click="editItemFill(item)" small value="1">
                        <v-icon :color="myColor.theme" small>fa-edit</v-icon>
                    </v-btn>
                    <v-btn
                            :color="item.complete ? myColor.green : myColor.dark "
                            @click="[item.complete = !item.complete, sendCompleteStatus(item._id, item.complete)]"
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
                               v-text="`Modified: ${getFormatDate(item.dateModify)}`"/>
                        <v-col class="pa-0 title grey--text font-weight-regular text--darken-2"
                               v-text="`Created: ${getFormatDate(item.dateCreate)}`"/>
                    </v-row>
                </v-sheet>
            </transition>
        </v-card>
    </div>
</template>

<script>
    import moment from "moment";

    moment.locale('ar-kw');

    const
        axios = require('axios'),
        postsURL = "http://localhost:5000/api/posts/";

    export default {
        name: "items",
        data: () => ({
            dialogEditItem: {
                "dialog": false,
                "simple": true
            },
            dialogAddItem: {
                "dialog": false,
                "simple": false
            },
            moreOption: false,
            newItem: {
                // id , complete , dateCreate , dateModify || Generate by DB
                companyId: '',
                name: '',
                quantity: '',
                unit: '',
                importance: 'On',
                price: '',
                description: ''
            },
            editItem: {
                "_id": "",
                "companyId": '',
                "name": '',
                "quantity": '',
                "unit": '',
                "importance": 'On',
                "price": '',
                "description": ''
            },
            searchShow: 0,
            myColor: {
                main: "indigo",
                theme: "white",
                second: "grey",
                green: "green",
                dark: "dark",
                deepPurple: "deep-purple",
                pink: "pink",
            },
            expand: false,
            items: [
                {
                    "id": 1,
                    "name": "Tomato",
                    "quantity": "12",
                    "unit": "Kg",
                    "price": "1500",
                    "dateCreate": "2019/2/1",
                    "dateModify": "2020/2/15",
                    "description": "XXXX",
                    "complete": true,
                    "importance": true,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
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
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
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
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/2/1",
                    dateModify: "2020-2-10",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 1,
                    name: "Tomato",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 2,
                    name: "Banana",
                    quantity: "12",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: false,
                },
                {
                    id: 3,
                    name: "joyce",
                    quantity: "12",
                    unit: "",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 4,
                    name: "oil",
                    quantity: "2",
                    unit: "lit",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 5,
                    name: "Sugar",
                    quantity: "12",
                    unit: "Kg",
                    price: "1500",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
                {
                    id: 6,
                    name: "Table",
                    quantity: "1",
                    price: "15000",
                    dateCreate: "2019/2/1",
                    dateModify: "2019/2/1",
                    description: "XXXX",
                    complete: true,
                },
            ],
            filter: {
                name: '', /* All case --- false --- contain "name" */
                date: {
                    menu: false,
                    dates: ['', ''],
                    /*
                    moment().subtract(2, 'days').format('YYYY-MM-DD'),
                    moment().format('YYYY-MM-DD')
                    */
                    cond: false /*All case --- false --- range: "2020/1/20 - 2020/1/23" --- this day --- this month*/
                },
                complete: true, /*All case --- false --- true*/
                price: false, /*"<55"*/ /* All Case --- false = without filter price --- less than x '<x' --- More than x '>x' --- equal x '=x' */
                quantity: false, /*"<5000"*/ /* All Case --- false = without filter price --- less than x '<x' --- More than x '>x' --- equal x '=x' */
                importance: false,
            }
        }),
        methods: {
            getFormatDate(date) {
                return moment(date).fromNow();
            },
            sendCompleteStatus(itemID, complete) {
                axios({
                    method: "PUT",
                    url: postsURL,
                    data: {
                        "id": itemID,
                        "user_id": this.user_id,
                        "update": {
                            "complete": complete,
                        },
                    }
                });
            },
            sendImportanceStatus(itemID, importance) {
                axios({
                    method: "PUT",
                    url: postsURL,
                    data: {
                        "id": itemID,
                        "user_id": this.user_id,
                        "update": {
                            "importance": importance,
                        },
                    }
                });
            },
            addNewItem() {
                this.dialogAddItem.dialog = false;
                //Create New Item
                axios({
                    method: "POST",
                    url: postsURL,
                    data: {
                        "name": this.newItem.name,
                        "quantity": this.newItem.quantity,
                        "unit": this.newItem.unit,
                        "price": this.newItem.price,
                        "description": this.newItem.description,
                        "complete": true,
                        "importance": this.newItem.importance,
                        "company_id": this.company_id,
                        "user_id": this.user_id
                    }
                })
                    .then(() => {
                        this.getItems();
                        this.newItem = {
                            companyId: '',
                            name: '',
                            quantity: '',
                            unit: '',
                            importance: 'On',
                            price: '',
                            description: ''
                        };
                    });
            },
            getItems() {
                axios.get(postsURL + this.company_id).then((res) => this.items = res.data);
            },
            editItemFill(item) {
                this.dialogEditItem.dialog = true;
                this.editItem._id = item._id;
                this.editItem.companyId = item.companyId;
                this.editItem.name = item.name;
                this.editItem.quantity = item.quantity;
                this.editItem.unit = item.unit;
                this.editItem.importance = item.importance ? "On" : "Off";
                this.editItem.price = item.price;
                this.editItem.description = item.description;
            },
            updateItem() {
                this.dialogEditItem.dialog = false;
                //Create New Item
                axios({
                    method: "PUT",
                    url: postsURL,
                    data: {
                        "id": this.editItem._id,
                        "user_id": this.user_id,
                        "update": {
                            "name": this.editItem.name,
                            "quantity": this.editItem.quantity,
                            "unit": this.editItem.unit,
                            "price": this.editItem.price,
                            "description": this.editItem.description,
                            "complete": true,
                            "importance": this.editItem.importance === "On",
                        },
                    }
                })
                    .then(() => {
                        this.getItems();
                        this.editItem = {
                            "_id": "",
                            "companyId": '',
                            "name": '',
                            "quantity": '',
                            "unit": '',
                            "importance": 'On',
                            "price": '',
                            "description": ''
                        };
                    });
            },
        },
        computed: {
            filteredItems: function () {
                let items = this.items;
                let f = this.filter;
                if (f.complete) {
                    items = items.filter(item => item.complete);
                    console.log("Done Filter Complete");
                }
                if (f.importance) {
                    items = items.filter(item => item.importance);
                    console.log("Done Filter Importance");
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
                if (f.date.cond) {
                    let
                        date = f.date.dates,
                        startDate = new Date(date[0]).getTime(),
                        endDate = new Date(date[1]).getTime();
                    if (startDate > endDate) {
                        let tmp = endDate;
                        endDate = startDate;
                        startDate = tmp;
                        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSS')
                    }

                    console.log(startDate, " XXX ", endDate);
                    console.log(new Date("2020-2-15").getTime());
                    console.log(startDate, " XXX ", endDate);
                    try {
                        if (startDate === endDate) {
                            items = items.filter(
                                i => startDate === new Date(i.dateModify).getTime()
                            );
                        } else {
                            items = items.filter(
                                i =>
                                    startDate <= new Date(i.dateModify).getTime()
                                    &&
                                    new Date(i.dateModify).getTime() <= endDate
                            );
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    console.log("Done filter Date");
                }
                return items
            },
            // eslint-disable-next-line vue/return-in-computed-property
            dateRangeText: function () {
                if (new Date(this.filter.date.dates[0]) > new Date(this.filter.date.dates[0])) {
                    const tmp = this.filter.date.dates[0];
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.filter.date.dates[0] = this.filter.date.dates[1];
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.filter.date.dates[1] = tmp;
                }
                return this.filter.date.dates.join(' ~ ')
            },
        },
        beforeCreate() {
            this.company_id = "5eb272f55ace9c3c18b969ca";
            this.user_id = "5eb272555ace9c3c18b969c9";
            axios.get(postsURL + this.company_id).then((res) => this.items = res.data);
        }
    }
</script>

<style lang="scss" scoped>
    @import "items.scss";
</style>
