function read(thisContinent) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            return parseData(this.response);
          }
        };
        xhttp.open("GET", "/" + thisContinent);
        xhttp.send();
}
//
function write() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/write", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(json.stringify(ojectForThisInstance));
}