/**
 * Created by Patrick Benard
 * 24/09/2014
 *
 */

/**
 * TODO :
 *     - Ajouter le template du footer utilisateur
 *     - Ajouter le footer utilisateur dans la construction de la table
 *     - Ajouter les setter/getter
 *     - Ajouter trigger avant/apres changement de page
 *     - Ajouter function pour afficher/cacher les éléments du tableau
 *
 */



$.fn.tatable = function(options){

    var container = $(this);

    if( typeof options != 'undefined' && options == "showHeader"){
        innerFunction.log('Affichage du header demandé','color:green;background:lightgrey');
        $('.tata-header').show();
        defaultOptions.showHeader = true;
        return true;
    }
    if( typeof options != 'undefined' && options == "hideHeader"){
        innerFunction.log('Masquage du header demandé','color:orange;background:lightgrey');
        $('.tata-header').hide();
        defaultOptions.showHeader = false;
        return true;
    }
    if( typeof options != 'undefined' && options == "showPagination"){
        innerFunction.log('Affichage du header demandé','color:green;background:lightgrey');
        $('.tata-footer').show();
        defaultOptions.showPagination = true;
        return true;
    }
    if( typeof options != 'undefined' && options == "hidePagination"){
        innerFunction.log('Masquage du header demandé','color:orange;background:lightgrey');
        $('.tata-footer').hide();
        defaultOptions.showPagination = false;
        return true;
    }

    if( typeof options != 'undefined' && parseInt(options) > 0){
        innerFunction.log('Options demandées :');
        innerFunction.log(options,'color:purple');
    }

    if( typeof options.datas == "undefined" ){
        innerFunction.log('Données non renseignées','color:black;background:red');
        innerFunction.log('-- Fin de procédure --','color:black;background:red');
    }

    if( typeof options.datas == "Object" ){
        innerFunction.log('Données non conforme - Création du type tableau','color:blue;background:lightgrey');
        options.datas= [ options.datas ];
        innerFunction.log('Nouvelles données :','color:purple');
        innerFunction.log(options.datas);
    }

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
        paginationCallback: undefined
    };

    var innerVariables = {
        currentPage:1,
        minShow: 1,
        maxShow:1,
        totalPage:1,
        total:0,
        css: {
            table: "tata-table table table-responsive",
            header: "tata-header",
            body: "tata-body",
            footer:"tata-footer",
            pagination: {
                ul : "tata-pagination ",
                li : "pagination"
            }
        },
        container: container,
        sortArg: null,
        sortDir: 'asc',
        dir: {
            asc: 'asc',
            desc: 'desc'
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
            innerFunction.log('Affichage des lignes n°'+innerVariables.minShow+' à '+innerVariables.maxShow+' demandé','color:blue;background:lightgrey');

            /**
             * Suppression de l'ancien body et creation d'un nouveau
             */
            innerFunction.log('Suppression du body actuel','color:blue;background:lightgrey');
            $('.tata-body').remove();
            innerFunction.log('Création du nouveau body');
            $tbody = $('<tbody></tbody>').addClass(innerVariables.css.body);

            /**
             * Pour chaque entité, on créait une ligne
             */
            for(var i = innerVariables.minShow - 1; i<= innerVariables.maxShow - 1; i++){
                if(typeof defaultOptions.datas[i] != "undefined"){

                    innerFunction.log('Création de la ligne '+i,'color:blue;background:lightgrey');
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
                            innerFunction.log('Création de la colone '+j+' de la ligne '+i,'color:blue;background:lightgrey');
                            $tr.append( $td.append(  $actualCol.template(defaultOptions.datas[i])     ) );
                        }
                    }
                    /**
                     * Insertion de la ligne dans le produit
                     */
                    innerFunction.log('Ajout de la ligne '+i+' dans le body','color:blue;background:lightgrey');
                    $tbody.append($tr);
                }
            }

            return $tbody;
        },
        updatePagination: function(){
            innerFunction.log('Mise à jour de la pagination','color:blue;background:lightgrey');
            innerFunction.spinner.show();
            $('[data-tata-page]').each(function(){
                $(this).removeClass('disabled active');
                if( $(this).data('tata-page') == innerVariables.currentPage ){
                    $(this).addClass('active');
                    innerFunction.log('Activation de la page '+innerVariables.currentPage,'color:green;background:lightgrey');
                }
            });
            if(typeof defaultOptions.paginationCallback != 'undefined' && typeof defaultOptions.paginationCallback != null ){
                innerFunction.log('Execution de la fonction callback','color:red;background:lightgrey');
                innerFunction.log(defaultOptions.paginationCallback,'color:red;background:black');
                eval(defaultOptions.paginationCallback+"()");
            }
            innerFunction.spinner.hide();
        },
        spinner:{
            show: function(){
                if(defaultOptions.spinner == true) {
                    innerFunction.log('Affichage du spinner','color:orange;background:lightgrey');
                    innerVariables.container.children().hide();
                    innerVariables.container.append($spinner);
                }
            },
            hide: function(){
                if(defaultOptions.spinner == true) {
                    innerFunction.log('Suppression du spinner','color:orange;background:lightgrey');
                    $('.tata-spinner').remove();
                    innerVariables.container.children().show();
                }
            }
        },
        log: function(message, style){
            if(defaultOptions.debug){
                if(typeof style != "undefined" ){
                    console.log('%c '+message, style);
                } else {
                    console.log(message);
                }
            }
        },
        compare: function(a,b){
            if( a[innerVariables.sortArg] > b[innerVariables.sortArg]){
                if(innerVariables.sortDir == 'asc'){
                    return -1;
                }
                return 1;
            }
            if( a[innerVariables.sortArg] < b[innerVariables.sortArg]){
                if(innerVariables.sortDir == 'asc'){
                    return 1;
                }
                return -1;
            }

            return 0;
        },
        sortCol: function(){
            innerFunction.log('Tri demandé sur '+ innerVariables.sortArg,'color:orange;background:lightgrey');
            innerFunction.log('Tri de type :  '+ innerVariables.sortDir,'color:orange;background:lightgrey');
            defaultOptions.datas.sort(innerFunction.compare);
            innerFunction.log('Nouvel Ordre : ','color:orange;background:lightgrey');
            innerFunction.log(defaultOptions.datas);
            innerVariables.currentPage = 1;
            innerFunction.updatePagination();
            $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
        }


    }

    /**
     * Init options
     */
    innerFunction.log('Lecture des options utilisateur :','color:orange;background:lightgrey');
    if(typeof options == "object" ){
        for(var key in options){
            defaultOptions[key] = options[key];
        }
    }
    innerFunction.log(defaultOptions,'color:purple');

    innerFunction.log('Instanciation de la table, du header, du corp et du footer','color:blue;background:lightgrey');
    $table = $('<table class="'+innerVariables.css.table+' '+defaultOptions.css.table+'"></table>');
    $theader = $('<thead class="'+innerVariables.css.header+' '+defaultOptions.css.header+'"></thead>');
    $tbody = $('<tbody class="'+innerVariables.css.body+' '+defaultOptions.css.body+'"></tbody>');
    $tfoot = $('<tfoot class="'+innerVariables.css.footer+' '+defaultOptions.css.footer+'"></tfoot>');
    $spinner = $('<div class="tata-spinner"><i class="fa fa-spin fa-spinner fa-2x"></i></div>');

    if(defaultOptions.spinner == true){
        innerFunction.spinner.show();
    }

    /**
     * Add headers
     */
    if( defaultOptions.showHeader ){
        innerFunction.log('Construction du header','color:blue;background:lightgrey');
        $tr = $('<tr></tr>');
        for(var i in defaultOptions.columnsToShow){
            var filter = "";

            if( typeof defaultOptions.columnsToShow[i][1] != 'undefined' && defaultOptions.sort == true ){
                filter = 'data-tata-sort="'+defaultOptions.columnsToShow[i][1]+'"';
            }
            $tr.append('<th '+filter+'>'+defaultOptions.columnsToShow[i][0]+'</th>')
        }
        $table.append(   $theader.append($tr)    );
        innerFunction.log("Fin d'ajout du header",'color:green;background:lightgrey');
    }

    /**
     * Add Body
     */
    innerVariables.total = defaultOptions.datas.length ;
    innerFunction.log("Total des données : "+innerVariables.total,'color:purple;background:lightgrey');
    innerVariables.totalPage = (innerVariables.total % defaultOptions.maxPerPage > 0 ) ?  parseInt( innerVariables.total / defaultOptions.maxPerPage ) + 1 : (innerVariables.total / defaultOptions.maxPerPage);
    innerFunction.log("Total des pages : "+innerVariables.totalPage,'color:purple;background:lightgrey');

    innerFunction.log("Page de construction demandée : "+innerVariables.currentPage,'color:green;background:lightgrey');
    $table.append( innerFunction.constructBody(innerVariables.currentPage)  );

    /**
     * Add Footer pagination
     */
    if(defaultOptions.showPagination == true){
        innerFunction.log("Construction de la pagination",'color:blue;background:lightgrey');
        $pagination = "";
        for(var m = 0; m < innerVariables.totalPage ; m++){
            $pagination += '<li class="'+innerVariables.css.pagination.li+' '+defaultOptions.css.pagination.li+'" data-tata-page="'+(parseInt(m)+1)+'"><a href="javascript:void(0)">'+(parseInt(m)+1)+'</a></li>';

            innerFunction.log("Ajout de la page de pagination : "+(parseInt(m)+1),'color:blue;background:lightgrey');
        }
        $table.append('<tfoot class="'+innerVariables.css.footer+'"><tr><td colspan="'+ defaultOptions.columns.length +'" class="text-right"><ul class="'+innerVariables.css.pagination.ul+' '+defaultOptions.css.pagination.ul+'">'+$pagination+'</ul><td></tr></tfoot>'  );
        innerFunction.log("Fin de création de la pagination",'color:green;background:lightgrey');
    }

    /**
     * Add table to target
     */
    innerFunction.log("Ajout des styles '"+innerVariables.css.table+" "+ defaultOptions.css.table +"' à la table");
    $table.addClass(innerVariables.css.table).addClass(defaultOptions.css.table).attr('id', defaultOptions.tableId );
    if(defaultOptions.spinner == true){
        innerFunction.spinner.hide();
    }
    $(this).append($table );
    innerFunction.updatePagination();

    /**
     * Pagination
     */
    innerFunction.log("Création des evenements sur les liens de pagination",'color:blue;background:lightgrey');
    $('li.pagination').on('click', function(e){
        innerFunction.log('Click sur pagination','color:green;background:lightgrey');
        innerVariables.currentPage = $(this).data('tata-page');

        innerFunction.log('Page demandée : '+innerVariables.currentPage);
        innerFunction.updatePagination();
        $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
        e.stopPropagation();

        innerFunction.log("Fin d'action click sur pagination",'color:green;background:lightgrey');
        $(this).trigger('pageChange');
    });

    /**
     * Sort
     */
    if(defaultOptions.sort == true){
        innerFunction.log("Création de l'action filtre sur titre de colonne");
        $('[data-tata-sort]').on('click', function(){
            var sort = $(this).data('tata-sort');
            if(innerVariables.sortArg == sort){
                innerFunction.log("Tri : Inversion du l'ordre");
                if(innerVariables.sortDir == innerVariables.dir.asc){
                    innerVariables.sortDir = innerVariables.dir.desc;
                } else {
                    innerVariables.sortDir = innerVariables.dir.asc;
                }
            } else {
                innerVariables.sortArg = sort;
                innerVariables.sortDir ==innerVariables.dir.asc;
                innerFunction.log("Tri : Nouveau tri");
            }
            innerFunction.sortCol();
        });
    }
};
