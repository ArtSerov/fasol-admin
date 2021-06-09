import Materialize from "materialize-css";

export  default {
    install(Vue){
        Vue.prototype.$message = function (text) {
            Materialize.toast({html:text, classes:'center'})
        }

        Vue.prototype.$error = function (html) {
            Materialize.toast({html: `[Ошибка]: ${html}`})
        }
    }
}
