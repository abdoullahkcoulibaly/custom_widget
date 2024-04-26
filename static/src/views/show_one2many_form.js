/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ListRenderer } from "@web/views/list/list_renderer";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";
import { useEffect } from "@odoo/owl";

export class CustomListRenderer extends ListRenderer {
    setup() {
        super.setup();
        useEffect(
            () => {
                this.keepColumnWidths = false;
            },
            () => [this.state.columns]
        );
    }


    processAllColumn(allColumns, list) {
        let cols = super.processAllColumn(...arguments);
        cols.push({
            type: 'opendetailsop',
            id: `column_detailOp_${cols.length}`,
            column_invisible: 'parent.state=="draft"',
        });
        return cols;
    }
}

CustomListRenderer.props = [ ...ListRenderer.props, 'customOpen?']

export class CustomX2ManyField extends X2ManyField {
    setup() {
        super.setup();
        this.canOpenRecord = true;
    }

    get isMany2Many() {
        return false;
    }

    async openRecord(record) {
        if (this.canOpenRecord) {
            const dirty = await record.isDirty();
            if (dirty && 'quantity' in record._changes) {
                await record.model.root.save({ reload: true });
            }
        }
        return super.openRecord(record);
    }
}

CustomX2ManyField.components = { ...X2ManyField.components, ListRenderer: CustomListRenderer };

export const customX2ManyField = {
    ...x2ManyField,
    component: CustomX2ManyField,
    additionalClasses: [...x2ManyField.additionalClasses || [], "o_field_one2many"],
};

registry.category("fields").add("show_one2many_form", customX2ManyField);
