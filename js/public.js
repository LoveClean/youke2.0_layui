export function returnLogin() {
    var pathName = window.document.location.pathname;
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    console.log(projectName);
    top.location.replace(projectName + "/login.html");
}

export const TEMP_URL='http://localhost:8082/';

function thePost(){

}