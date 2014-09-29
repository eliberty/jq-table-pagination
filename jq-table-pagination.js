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
 */

/**
 *
 * Store every data from tatables
 */
var tatableOptions = {};

$.fn.tatable = function(options){

    /**
     * Inner Functions used for methods or generation
     */
    var innerFunction = {
        constructBody : function(pageNumber){
            innerFunction.log('Construction du body de la table', undefined, defaultOptions.debug);

            /**
             * Définition des minima et maxima à afficher
             */
            innerVariables.minShow = pageNumber * defaultOptions.maxPerPage - defaultOptions.maxPerPage + 1;
            innerVariables.maxShow = innerVariables.minShow + (defaultOptions.maxPerPage - 1);
            innerFunction.log('Affichage des lignes n°'+innerVariables.minShow+' à '+innerVariables.maxShow+' demandé','color:blue;background:lightgrey', defaultOptions.debug);

            /**
             * Suppression de l'ancien body et creation d'un nouveau
             */
            innerFunction.log('Suppression du body actuel','color:blue;background:lightgrey', defaultOptions.debug);
            $('.tata-body').remove();
            innerFunction.log('Création du nouveau body', undefined, defaultOptions.debug);
            $tbody = $('<tbody></tbody>').addClass(innerVariables.css.body);

            /**
             * Pour chaque entité, on créait une ligne
             */
            for(var i = innerVariables.minShow - 1; i<= innerVariables.maxShow - 1; i++){
                if(typeof defaultOptions.datas[i] != "undefined"){

                    innerFunction.log('Création de la ligne '+i,'color:blue;background:lightgrey', defaultOptions.debug);
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
                            innerFunction.log('Création de la colone '+j+' de la ligne '+i,'color:blue;background:lightgrey', defaultOptions.debug);
                            $tr.append( $td.append(  $actualCol.template(defaultOptions.datas[i])     ) );
                        }
                    }
                    /**
                     * Insertion de la ligne dans le produit
                     */
                    innerFunction.log('Ajout de la ligne '+i+' dans le body','color:blue;background:lightgrey', defaultOptions.debug);
                    $tbody.append($tr);
                }
            }

            return $tbody;
        },
        updatePagination: function(){
            innerFunction.log('Mise à jour de la pagination','color:blue;background:lightgrey', defaultOptions.debug);
            innerFunction.spinner.show();
            $('[data-tata-page]').each(function(){
                $(this).removeClass('disabled active');
                if( $(this).data('tata-page') == innerVariables.currentPage ){
                    $(this).addClass('active');
                    innerFunction.log('Activation de la page '+innerVariables.currentPage,'color:green;background:lightgrey', defaultOptions.debug);
                }
            });
            if(typeof defaultOptions.paginationCallback != 'undefined' && typeof defaultOptions.paginationCallback != null ){
                innerFunction.log('Execution de la fonction callback','color:red;background:lightgrey', defaultOptions.debug);
                innerFunction.log(defaultOptions.paginationCallback,'color:red;background:black', defaultOptions.debug);
                eval(defaultOptions.paginationCallback+"()");
            }
            innerFunction.spinner.hide();
        },
        spinner:{
            show: function(){
                if(defaultOptions.spinner == true) {
                    innerFunction.log('Affichage du spinner','color:orange;background:lightgrey', defaultOptions.debug);
                    innerVariables.container.children().hide();
                    innerVariables.container.append($spinner);
                }
            },
            hide: function(){
                if(defaultOptions.spinner == true) {
                    innerFunction.log('Suppression du spinner','color:orange;background:lightgrey', defaultOptions.debug);
                    $('.tata-spinner').remove();
                    innerVariables.container.children().show();
                }
            }
        },
        log: function(message, style, debug){
            if( debug ){
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
            innerFunction.log('Tri demandé sur '+ innerVariables.sortArg,'color:orange;background:lightgrey', defaultOptions.debug);
            innerFunction.log('Tri de type :  '+ innerVariables.sortDir,'color:orange;background:lightgrey', defaultOptions.debug);
            defaultOptions.datas.sort(innerFunction.compare);
            innerFunction.log('Nouvel Ordre : ','color:orange;background:lightgrey', defaultOptions.debug);
            innerFunction.log(defaultOptions.datas, undefined, defaultOptions.debug);
            innerVariables.currentPage = 1;
            innerFunction.updatePagination();
            $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
        },
        filter: function(filterName){
            innerFunction.log("Entrée dans innerFunction filter", undefined, defaultOptions.debug);
            var newDatas = innerVariables.baseDatas;
            if(typeof  filterName != 'undefined'){
                var newDatas = defaultOptions.filters[filterName](  innerVariables.baseDatas    );
            }
            defaultOptions.datas = newDatas;
            innerFunction.log("New datas : ", undefined, defaultOptions.debug);
            innerFunction.log(defaultOptions.datas, undefined, defaultOptions.debug);
            innerVariables.currentPage = 1;
            innerFunction.updatePagination();
            $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
            innerFunction.constructPagination();
        },
        constructPagination: function(){
            if(defaultOptions.showPagination == true){

                $('tfoot.'+innerVariables.css.footer).remove();
                innerVariables.currentPage = 1;

                innerVariables.total = defaultOptions.datas.length ;
                innerFunction.log("Total des données : "+innerVariables.total,'color:purple;background:lightgrey', defaultOptions.debug);
                innerVariables.totalPage = (innerVariables.total % defaultOptions.maxPerPage > 0 ) ?  parseInt( innerVariables.total / defaultOptions.maxPerPage ) + 1 : (innerVariables.total / defaultOptions.maxPerPage);
                innerFunction.log("Total des pages : "+innerVariables.totalPage,'color:purple;background:lightgrey', defaultOptions.debug);


                innerFunction.log("Construction de la pagination",'color:blue;background:lightgrey',defaultOptions.debug);
                $pagination = "";
                for(var m = 0; m < innerVariables.totalPage ; m++){
                    $pagination += '<li class="'+innerVariables.css.pagination.li+' '+defaultOptions.css.pagination.li+'" data-tata-page="'+(parseInt(m)+1)+'"><a href="javascript:void(0)">'+(parseInt(m)+1)+'</a></li>';

                    innerFunction.log("Ajout de la page de pagination : "+(parseInt(m)+1),'color:blue;background:lightgrey', defaultOptions.debug);
                }
                $table.append('<tfoot class="'+innerVariables.css.footer+'"><tr><td colspan="'+ defaultOptions.columns.length +'" class="text-right"><ul class="'+innerVariables.css.pagination.ul+' '+defaultOptions.css.pagination.ul+'">'+$pagination+'</ul><td></tr></tfoot>'  );
                innerFunction.log("Fin de création de la pagination",'color:green;background:lightgrey', defaultOptions.debug);
                innerFunction.updatePagination();
            }
            /**
             * Pagination Click
             */
            innerFunction.log("Création des evenements sur les liens de pagination",'color:blue;background:lightgrey', defaultOptions.debug);
            $('li.pagination').on('click', function(e){
                innerFunction.log('Click sur pagination','color:green;background:lightgrey', defaultOptions.debug);
                innerVariables.currentPage = $(this).data('tata-page');

                innerFunction.log('Page demandée : '+innerVariables.currentPage, undefined, defaultOptions.debug);
                innerFunction.updatePagination();
                $('.tata-table').append(  innerFunction.constructBody(innerVariables.currentPage)  );
                e.stopPropagation();

                innerFunction.log("Fin d'action click sur pagination",'color:green;background:lightgrey', defaultOptions.debug);
                $(this).trigger('pageChange');
            });
        }
    };

    var container = $(this);

    /**
     * Methods
     *    - showHeader
     *    - hideHeader
     *    - showPagination
     *    - hidePagination
     */
    if( typeof options != 'undefined' && options == "showHeader"){
        console.log('debug : '+tatableOptions[$(this)].debug);
        innerFunction.log('Affichage du header demandé','color:green;background:lightgrey', tatableOptions[$(this)].debug );
        $(this).find('.tata-header').show();
        tatableOptions[$(this)].showHeader = true;
        return true;
    }
    if( typeof options != 'undefined' && options == "hideHeader"){

        console.log('debug : '+tatableOptions[$(this)].debug);
        innerFunction.log('Masquage du header demandé','color:orange;background:lightgrey', tatableOptions[$(this)].debug);
        $(this).find('.tata-header').hide();
        tatableOptions[$(this)].showHeader = false;
        return true;
    }
    if( typeof options != 'undefined' && options == "showPagination"){
        innerFunction.log('Affichage du header demandé','color:green;background:lightgrey');
        $(this).find('.tata-footer').show();
        tatableOptions[$(this)].showPagination = true;
        return true;
    }
    if( typeof options != 'undefined' && options == "hidePagination"){
        innerFunction.log('Masquage du header demandé','color:orange;background:lightgrey');
        $(this).find('.tata-footer').hide();
        tatableOptions[$(this)].showPagination = false;
        return true;
    }


    /**
     * Traitement des options ( construction de la tatable )
     */
    if( typeof options != 'undefined' && parseInt(options) > 0){
        innerFunction.log('Options demandées :', undefined, defaultOptions.debug);
        innerFunction.log(options,'color:purple', defaultOptions.debug);
    }

    if( typeof options.datas == "undefined" ){
        innerFunction.log('Données non renseignées','color:black;background:red', defaultOptions.debug);
        innerFunction.log('-- Fin de procédure --','color:black;background:red', defaultOptions.debug);
    }

    if( typeof options.datas == "Object" ){
        innerFunction.log('Données non conforme - Création du type tableau','color:blue;background:lightgrey', defaultOptions.debug);
        options.datas= [ options.datas ];
        innerFunction.log('Nouvelles données :','color:purple', defaultOptions.debug);
        innerFunction.log(options.datas, undefined, defaultOptions.debug);
    }


    /**
     * Options par defaut
     *
     */
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

    /**
     * Variables non configurables par l'utilisateur
     */
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
        },
        baseDatas: []
    };


    /**
     * Initialisation des options
     */
    innerFunction.log('Lecture des options utilisateur :','color:orange;background:lightgrey', defaultOptions.debug);
    if(typeof options == "object" ){
        for(var key in options){
            defaultOptions[key] = options[key];
        }
    }
    innerVariables.baseDatas = defaultOptions.datas;
    innerFunction.log(defaultOptions,'color:purple', defaultOptions.debug);
    tatableOptions[$(this)]= defaultOptions;





    innerFunction.log('Instanciation de la table, du header, du corp et du footer','color:blue;background:lightgrey', defaultOptions.debug);
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
        innerFunction.log('Construction du header','color:blue;background:lightgrey', defaultOptions.debug);
        $tr = $('<tr></tr>');
        for(var i in defaultOptions.columnsToShow){
            var filter = "";

            if( typeof defaultOptions.columnsToShow[i][1] != 'undefined' && defaultOptions.sort == true ){
                filter = 'data-tata-sort="'+defaultOptions.columnsToShow[i][1]+'"';
            }
            $tr.append('<th '+filter+'>'+defaultOptions.columnsToShow[i][0]+'</th>')
        }
        $table.append(   $theader.append($tr)    );
        innerFunction.log("Fin d'ajout du header",'color:green;background:lightgrey', defaultOptions.debug);
    }

    /**
     * Add Body
     */
    innerVariables.total = defaultOptions.datas.length ;
    innerFunction.log("Total des données : "+innerVariables.total,'color:purple;background:lightgrey', defaultOptions.debug);
    innerVariables.totalPage = (innerVariables.total % defaultOptions.maxPerPage > 0 ) ?  parseInt( innerVariables.total / defaultOptions.maxPerPage ) + 1 : (innerVariables.total / defaultOptions.maxPerPage);
    innerFunction.log("Total des pages : "+innerVariables.totalPage,'color:purple;background:lightgrey', defaultOptions.debug);

    innerFunction.log("Page de construction demandée : "+innerVariables.currentPage,'color:green;background:lightgrey', defaultOptions.debug);
    $table.append( innerFunction.constructBody(innerVariables.currentPage)  );




    /**
     * Add table to target
     */
    innerFunction.log("Ajout des styles '"+innerVariables.css.table+" "+ defaultOptions.css.table +"' à la table", undefined, defaultOptions.debug);
    $table.addClass(innerVariables.css.table).addClass(defaultOptions.css.table).attr('id', defaultOptions.tableId );
    if(defaultOptions.spinner == true){
        innerFunction.spinner.hide();
    }
    $(this).append($table );


    /**
     * Add Footer pagination
     */
    innerFunction.constructPagination();
    innerFunction.updatePagination();


    /**
     * Sort on header Click
      */
    if(defaultOptions.sort == true){
        innerFunction.log("Création de l'action filtre sur titre de colonne", undefined, defaultOptions.debug);
        $('[data-tata-sort]').on('click', function(){
            var sort = $(this).data('tata-sort');
            if(innerVariables.sortArg == sort){
                innerFunction.log("Tri : Inversion du l'ordre", undefined, defaultOptions.debug);
                if(innerVariables.sortDir == innerVariables.dir.asc){
                    innerVariables.sortDir = innerVariables.dir.desc;
                } else {
                    innerVariables.sortDir = innerVariables.dir.asc;
                }
            } else {
                innerVariables.sortArg = sort;
                innerVariables.sortDir ==innerVariables.dir.asc;
                innerFunction.log("Tri : Nouveau tri", undefined, defaultOptions.debug);
            }
            innerFunction.sortCol();
        });
    }

    /**
     * Set filters on elements
     */
    if(  defaultOptions.filter == true ){
        $('[tata-filter]').on('click', function(){
            innerFunction.log("Click sur filtre : "+ $(this).attr("tata-filter"), undefined, defaultOptions.debug);
            innerFunction.filter( $(this).attr("tata-filter")  );
        });
    }
};
