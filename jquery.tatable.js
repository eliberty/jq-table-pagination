/**
 * Created by Patrick Benard
 * 24/09/2014
 *
 */



$.fn.tatable = function(options){

    if( parseInt(options) > 0){
        console.log(innerVariables);
    }

    var defaultOptions = {
        tableId : "tatable",
        datas : [],
        showHeader : true,
        pagination : true,
        maxPerPage : 2,
        columnsToShow: null,
        footer : null,
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

    var innerVariables = {
        currentPage:1,
        minShow: 1,
        maxShow:1,
        totalPage:1,
        total:0,
        css: {
            table : "tata-table table table-responsive",
            header : "tata-header",
            body: "tata-body",
            footer:"tata-footer",
            pagination: {
                ul : "tata-pagination ",
                li : "pagination"
            }
        }
    };

    var innerFunction = {
        constructBody : function(pageNumber){
            innerFunction.log('Construction du body de la table');

            /**
             * Définition des minima et maxima à afficher
             */
            innerVariables.minShow = pageNumber * defaultOptions.maxPerPage - defaultOptions.maxPerPage + 1;
            innerVariables.maxShow = innerVariables.minShow + (defaultOptions.maxPerPage - 1);
            innerFunction.log('Affichage des lignes n°'+innerVariables.minShow+' à '+innerVariables.maxShow+' demandé');

            /**
             * Suppression de l'ancien body et creation d'un nouveau
             */
            innerFunction.log('Suppression du body actuel');
            $('.tata-body').remove();
            innerFunction.log('Création du nouveau body');
            $tbody = $('<tbody></tbody>').addClass(innerVariables.css.body);

            /**
             * Pour chaque entité, on créait une ligne
             */
            for(var i = innerVariables.minShow - 1; i<= innerVariables.maxShow - 1; i++){
                if(typeof defaultOptions.datas[i] != "undefined"){

                    innerFunction.log('Création de la ligne '+i);
                    /**
                     *  Creation ligne
                     */
                    $tr = $('<tr></tr>').addClass(defaultOptions.css.tr);

                    /**
                     * Creation colonne
                     */
                    for(var j in defaultOptions.columns){

                        $td = $('<td></td>').addClass(defaultOptions.css.td);
                        $actualCol = defaultOptions.columns[j];

                        /**
                         * Insertion du template dans la colonne
                         */
                        if(typeof $actualCol.template != "undefined"){
                            innerFunction.log('Création de la colone '+j+' de la ligne '+i);
                            $tr.append( $td.append(  $actualCol.template(defaultOptions.datas[i])     ) );
                        }
                    }
                    /**
                     * Insertion de la ligne dans le produit
                     */
                    innerFunction.log('Ajout de la ligne '+i+' dans le body');
                    $tbody.append($tr);
                }
            }

            return $tbody;
        },
        updatePagination: function(){
            innerFunction.log('Mise à jour de la pagination');
            $('[data-tata-page]').each(function(){
                $(this).removeClass('disabled active');
                if( $(this).data('tata-page') == innerVariables.currentPage ){
                    $(this).addClass('active');
                    innerFunction.log('Activation de la page '+innerVariables.currentPage);
                }
            });
        },
        log: function(message){
            if(defaultOptions.debug){
                console.log(message);
            }
        }

    }

    innerFunction.log('Instanciation de la table, du header, du corp et du footer');
    $table = $('<table class="'+innerVariables.css.table+' '+defaultOptions.css.table+'"></table>');
    $theader = $('<thead class="'+innerVariables.css.header+' '+defaultOptions.css.header+'"></thead>');
    $tbody = $('<tbody class="'+innerVariables.css.body+' '+defaultOptions.css.body+'"></tbody>');
    $tfoot = $('<tfoot class="'+innerVariables.css.footer+' '+defaultOptions.css.footer+'"></tfoot>');


    /**
     * Init options
     */
    innerFunction.log('Lecture des options utilisateur :');
    if(typeof options == "object" ){
        for(var key in options){
            defaultOptions[key] = options[key];
        }
    }
    innerFunction.log(defaultOptions);

    /**
     * Add headers
     */
    if( defaultOptions.showHeader ){
        innerFunction.log('Construction du header');
        $tr = $('<tr></tr>');
        for(var i in defaultOptions.columnsToShow){
            $tr.append('<th>'+defaultOptions.columnsToShow[i]+'</th>')
        }
        $table.append(   $theader.append($tr)    );
        innerFunction.log("Fin d'ajout du header");
    }

    /**
     * Add Body
     */
    innerVariables.total = defaultOptions.datas.length ;
    innerFunction.log("Total des données : "+innerVariables.total);
    innerVariables.totalPage = (innerVariables.total % defaultOptions.maxPerPage > 0 ) ?  parseInt( innerVariables.total / defaultOptions.maxPerPage ) + 1 : (innerVariables.total / defaultOptions.maxPerPage);
    innerFunction.log("Total des pages : "+innerVariables.totalPage);

    innerFunction.log("Page de construction demandée : "+innerVariables.currentPage);
    $table.append( innerFunction.constructBody(innerVariables.currentPage)  );

    /**
     * Add pagination
     */
    if(defaultOptions.pagination == true){
        innerFunction.log("Construction de la pagination");
        $pagination = "";
        for(var m = 0; m < innerVariables.totalPage ; m++){
            $pagination += '<li class="'+innerVariables.css.pagination.li+' '+defaultOptions.css.pagination.li+'" data-tata-page="'+(parseInt(m)+1)+'"><a href="javascript:void(0)">'+(parseInt(m)+1)+'</a></li>';

            innerFunction.log("Ajout de la page de pagination : "+(parseInt(m)+1));
        }
        $table.append('<tfoot><tr><td colspan="'+ defaultOptions.columns.length +'" class="text-right"><ul class="'+innerVariables.css.pagination.ul+' '+defaultOptions.css.pagination.ul+'">'+$pagination+'</ul><td></tr></tfoot>'  );
        innerFunction.log("Fin de création de la pagination");
    }

    /**
     * Add table to target
     */
    innerFunction.log("Ajout des styles '"+innerVariables.css.table+" "+ defaultOptions.css.table +"' à la table");
    $table.addClass(innerVariables.css.table).addClass(defaultOptions.css.table).attr('id', defaultOptions.tableId );
    $(this).append($table );
    innerFunction.updatePagination();

    innerFunction.log("Création des evenements sur les liens de pagination");
    $('li.pagination').on('click', function(e){
        innerFunction.log('Click sur pagination');
        innerVariables.currentPage = $(this).data('tata-page');

        innerFunction.log('Page demandée : '+innerVariables.currentPage);
        innerFunction.updatePagination();
        $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
        e.stopPropagation();

        innerFunction.log("Fin d'action click sur pagination");
        return false;
    })
};
