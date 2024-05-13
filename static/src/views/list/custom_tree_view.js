/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ListRenderer } from "@web/views/list/list_renderer";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
import { useService } from "@web/core/utils/hooks";


import { useEffect, useState,  onMounted, onPatched, onWillPatch, onWillUpdateProps, onWillStart } from "@odoo/owl";

export class CustomTreeViewRenderer extends ListRenderer {
    static recordRowTemplate = "custom_widget.CustomTreeViewRenderer.RecordRow";
    setup() {
        super.setup();
        this.uiService = useService("ui");
        this.isCustom = true;
        this.state = useState({
            columns: this.getActiveColumns(this.props.list),
            groups: {},
            groupItems: this.state.columns.filter((col) => col.type === 'field'),
            selectedItem: null
        });

        onWillStart(async () => {
            this.state.selectedItem = this.state.groupItems[0].name;
            this.state.groups = this.groupedList(this.groupBy);
        });

    }

    async toggleGroupField(fieldName) {
        this.state.selectedItem = fieldName;
        this.state.groups = this.groupedList(this.state.selectedItem);
    }

    toggleCustomGroup(group) {
        group.isFolded = !group.isFolded;
    }

    getCustomGroupLevel(group) {
        return this.state.groups.length - group.list.records.length - 1;
    }

    getGroupCellColSpan(group) {

        if (group.isFolded) {
            return this.state.columns.length;
        }

        let colspan = Object.keys(this.state.columns).length;

        if (this.displayOptionalFields) {
            colspan += 1;
        }

        if (this.hasSelectors) {
            colspan += 1;
        }


        if (this.props.onOpenFormView) {
            colspan += 1;
        }

        return colspan;
    }



    set groupBy(item){
        this.state.selectedItem = item;
    }
    get groupBy(){
        return this.state.selectedItem;
    }

    groupedList(groupName) {
        const grouped = {};
        let groupId = 1;

        for (const record of this.props.list.records) {
            const data = record.data;
            const group = data[groupName];

            if (grouped[group]  === undefined) {
                grouped[group] = {
                    id: parseInt(groupId++),
                    count: 0,
                    name: group,
                    isFolded: true,
                    list: {
                        records: [],
                    },
                };
            }


            grouped[group].list.records.push(record);
            grouped[group].count++;

        }

        return grouped;
    }



}

export class CustomTreeX2ManyField extends X2ManyField {
    setup() {
        super.setup();
    }

}

CustomTreeX2ManyField.components = { ...X2ManyField.components, ListRenderer: CustomTreeViewRenderer };

export const customTreeX2ManyField = {
    ...x2ManyField,
    component: CustomTreeX2ManyField,
    additionalClasses: [...x2ManyField.additionalClasses || [], "o_field_one2many"],
};

registry.category("fields").add("custom_tree_view", customTreeX2ManyField);