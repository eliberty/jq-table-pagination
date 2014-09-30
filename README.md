jq Table Pagination
=============

Simple jQuery Table with pagination, sort, filter, for json object





Exemple
=============
<code>

	var datasource = [
		{
			'createdAt': "10/10/2014 08:00:00",
			'debit': 100,
			'credit': 0,
			'message': "Loto"
		},
		{
			'createdAt': "10/10/2014 09:00:00",
			'debit': 0,
			'credit': 200,
			'message': "DAB"
		},
		{
			'createdAt': "10/10/2014 10:00:00",
			'debit': 400,
			'credit': 0,
			'message': "DAB"
		}
	];

	         $('#assets_paginated').tatable({
                maxPerPage: 2,
                datas: datasource,
                columnsToShow : [['Date', 'createdAt'], ['Points','credit'], ['Actions','message']],
                columns : [
                    {
                        template: function(object){
                            var date = new Date(object['createdAt']);
                            var dateString = date.toLocaleDateString();
                            return dateString;
                        }
                    },
                    {
                        template : function(object){
                            if(object['credit'] > 0){
                                return '<button class="btn btn-success">'+   numeral(parseFloat(object['credit']) / 100).format('0.00 $')    +"</button>" ;
                            }
                            return '<button class="btn btn-warning">'+  numeral(parseFloat(object['debit']) / 100).format('0.00 $')   +"</button>";
                        }
                    },
                    {
                        template : function(object){
                            return object['message'];
                        }
                    }
                ],
                css:{
                    pagination:{
                        ul:"pagination"
                    }
                },
                debug:true,
                filters: {
                    debit: function(datas){
                        var filteredData= new Array();
                        for(var i in datas){
                            if(datas[i]['debit'] > 0){
                                filteredData.push(datas[i]);
                            }
                        }
                        return filteredData;
                    },
                    credit: function(datas){
                        var filteredData= new Array();
                        for(var i in datas){
                            if(datas[i]['credit'] > 0){
                                filteredData.push(datas[i]);
                            }
                        }
                        return filteredData;

                    },
                    none: function(datas){
                        return datas;
                    }
                }
            });
</code>



Options
=============
<code>
    var defaultOptions = {
        tableId : "tatable",
        datas : [],
        spinner: true,
        showHeader : true,
        sort: true,
        pagination : true,
        maxPerPage : 2,
        columnsToShow: null,
        showFooter: false,
        footer : null,
        showPagination: true,
        css: {
            table: " ",
            header: " ",
            body: " ",
            footer:" ",
            tr:" ",
            td:" ",
            pagination: {
                ul: "  ",
                li: ""
            }
        },
        debug: false,
        paginationCallback: undefined,
        filter: true,
        filters: undefined
    };
</code>

Columns To Show
=============
<code>
columnsToShow : [['Date', 'createdAt'], ['Points','credit'], ['Actions','message']],
</code>

['label', 'objectField_To_Sort']

Definitions
=============

* tableId : String - table Id
* datas : Array - datasource array of json object
* showHeader : Boolean - header's visibility
* pagination : Boolean - pagination's visibility
* maxPerPage : Int - the number of rows to show per page
* columnsToShow : Array - Columns Label
* css : Json Object

* css.table : String - table class
* css.header : String - header class
* css.body : String - body class
* css.footer : String - footer class
* css.tr : String - tr class
* css.td : String - td class
* css.pagination : Json Object

* css.pagination.ul : String - pagination ul class
* css.pagination.li : String - pagination li class


Filters
=============
Click on the following button will exectute the filter call "none"

<code>
	<button type="button" class="btn btn-default" tata-filter="none">{%trans%}rp.profil.assets.filter.all{%endtrans%}</button>
</code>






