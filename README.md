jQueryTatable
=============

Simple jQuery Table





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

	  $(selector).tatable({
	        maxPerPage: 2,
	        datas: datasource,
	        columnsToShow : ['Date', 'Amount', 'Action'],
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
	                        return '<button class="btn btn-success">'+object['credit']+"</button>" ;
	                    }
	                    return '<button class="btn btn-warning">'+object['debit']+"</button>";
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
	        debug:true

	    });
</code>



Options
=============
<code>
    var defaultOptions = {
        tableId : "tatable",
        datas : [],
        showHeader : true,
        pagination : true,
        maxPerPage : 2,
        columnsToShow: null,
        css: {
            table : " ",
            header : " ",
            body: " ",
            footer:" ",
            tr:" ",
            td:" ",
            pagination: {
                ul : "  ",
                li : ""
            }
        },
        debug: false
    };
</code>

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






