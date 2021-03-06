sap.ui.define([],

function (){
    "use strict";
    return {
        showPDF: function(oEvent) {
/* =================================================================== 
    Recupera a linha selecionada 
=================================================================== */
            var oSelection = this.extensionAPI.getSelectedContexts();
            var vChave = '';

            if(oSelection.length > 1){
                alert('Selecionar apenas uma linha para a geração de boleto');
                return;
            }   

            if(oSelection.length > 0){
                vChave =  oSelection.reduce(function(sText,oSelectedContext){
                    var mSelectedData = oSelectedContext.getObject();

                    if(mSelectedData.NossoNumero == ''){
                        return; 
                    }

                    return sText + 
                           "empresa='" + mSelectedData.Empresa +"'," + 
                           "documento='" + mSelectedData.NumDocumento +"'," +
                           "exercicio='" + mSelectedData.Exercicio +"'," + 
                           "item='" + mSelectedData.ItemDocumento +"'" ;
                }, "");
            }

            if(!vChave){
                alert('Boleto não disponível');
                return;
            }

/* =================================================================== 
    Chama serviço gateway (SEGW) 
=================================================================== */

            var vServiceURL = "/sap/opu/odata/SAP/ZFI_BOLETO_SRV_SRV/";
            var oModel = new sap.ui.model.odata.ODataModel(vServiceURL, false);

            var vServiceUrlRead = "pdfset("+ vChave + ")/$value";

            oModel.read(vServiceUrlRead,null,null,true, 
/* =================================================================== 
    Em caso de sucesso, Chama PDF Viewer com o novo link 
=================================================================== */                
                function(oData){

                    var sSource = vServiceURL + vServiceUrlRead;
                    var opdfViewer = new sap.m.PDFViewer(); 
                    this.getView().addDependent(opdfViewer); 
                    opdfViewer.setSource(sSource); 
                    opdfViewer.setTitle("My PDF"); 
                    opdfViewer.open();
                }.bind(this),

                function(error){
                    alert('Falha ao buscar arquivo');
                })

            
        }
    };
});


// sap.ui.define([],
//     function (){
//         "use strict";
//         return sap.ui.controller(br.com.meta.envioboleto.ext.controller.ListReportExt, {
//             showPDF: function(oEvent) {
//                 alert('showPDF');
//             }
//         });
//     });


    