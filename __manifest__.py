# -*- coding: utf-8 -*-
{
    'name': 'Custom Widget',
    'version': '17.1',
    'author': "PROGISTACK",
    'maintainer': "Abdoulaye K. Coulibaly",
    'category': 'Uncategorized',
    'sequence': 30,
    'summary': 'Custom Widget',
    'description': """
    Custom Widget
    """,
    'depends': ['base', 'stock'],
    'data': [
        'views/stock_picking.xml'
    ],

    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
            'custom_widget/static/src/views/show_one2many_form.js',
            'custom_widget/static/src/views/list/custom_tree_view.js',
            'custom_widget/static/src/views/list/custom_tree_view.xml',
            'custom_widget/static/src/views/list/list_renderer.xml',
        ],
    }
}
