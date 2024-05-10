/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ListRenderer } from "@web/views/list/list_renderer";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
import { useService } from "@web/core/utils/hooks";


import { useEffect, useState,  onMounted, onPatched, onWillPatch, onWillUpdateProps, } from "@odoo/owl";

export class CustomTreeViewRenderer extends ListRenderer {
    static recordRowTemplate = "custom_widget.CustomTreeViewRenderer.RecordRow";
    setup() {
        super.setup();
        this.uiService = useService("ui");
        this.isCustom = true;
        this.state = useState({
            columns: this.getActiveColumns(this.props.list),
            groups: this.groupedList()
        });

    }
    toggleCustomGroup(group) {
        group.isFolded = !group.isFolded;

    }

    getCustomGroupLevel(group) {
        return this.state.groups.length - group.list.records.length - 1;
    }

    getGroupCellColSpan(group) {
        // Si le groupe est plié, le colspan est égal au nombre total de colonnes
        if (group.isFolded) {
            return this.state.columns.length;
        }

        // Si le groupe est déplié et contient des enregistrements, le colspan est calculé
        // en fonction du nombre de colonnes dans la liste
        let colspan = Object.keys(this.state.columns).length;

        // Ajoute 1 pour chaque colonne facultative
        if (this.displayOptionalFields) {
            colspan += 1;
        }

        // Ajoute 1 pour chaque sélecteur
        if (this.hasSelectors) {
            colspan += 1;
        }

        // Ajoute 1 pour chaque action de formulaire ouverte
        if (this.props.onOpenFormView) {
            colspan += 1;
        }

        return colspan;
    }



    get groupBy(){
        return "code";
    }

    groupedList() {
        const grouped = {};
        let groupId = 1;

        for (const record of this.props.list.records) {
            const data = record.data;
            const group = data[this.groupBy];

            if (!grouped[group]) {
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