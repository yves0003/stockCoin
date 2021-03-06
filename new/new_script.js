{
    const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => (el.includes(val)? [...acc, i] : acc), []);

    
    async function updateTable(root){
        root.querySelector(".table-refresh__button").classList.add("table-refresh__button--refreshing");
        const table = root.querySelector(".table-refresh__table");
        const response = await fetch(root.dataset.url);
        const data = await response.json();
        //clear table
        table.querySelector('thead tr').innerHTML="";
        table.querySelector('tbody').innerHTML="";
        //get the hidden columns
        let hidden = indexOfAll(data.infosData, "Hidden");
        //get link
        let indexlink = indexOfAll(data.infosData, "HyperlinkType");
        let colWithLinks = [];
        let indexCol = indexlink.reduce((acc,curr)=> (acc[curr]=data.infosData[curr].substr(14,1).charCodeAt(0)-64-1/*parce que les boucles commencent à 0*/, acc),{});
        
        //populate rows
        for(const row of data.rows){
            table.querySelector('tbody').insertAdjacentHTML("beforeend",`
                <tr>
                    ${row.map((col,index) => {
                        if (indexlink.includes(index)) {
                            colWithLinks.push(indexCol[index])
                            return `<td><a href="${row[indexCol[index]]}" target="_blank">${col}</a></td>`;
                        } else if(!hidden.includes(index) && !colWithLinks.includes(index)){
                            if (!isNaN(col.replace(" ","").replace(",",".").replace("%",""))) {
                                if (parseFloat(col.replace(" ","").replace(",",".").replace("%",""))>=0) {
                                    return `<td class="green-text">${col}</td>`;
                                }else {
                                    return `<td class="red-text">${col}</td>`;
                                }
                            } else {
                                return `<td>${col=="#N/A"?"":col.replace(" ","")}</td>`;
                            }
                            
                        }
                    }).join("")}
                </tr>
            `);
        }
        //populate header
        console.log(data.entetes);
        data.entetes.forEach((header,index) => {
             //
            if (!hidden.includes(index) && !colWithLinks.includes(index)) {
               
                table.querySelector('thead tr').insertAdjacentHTML("beforeend",`<th>${header}</th>`);
            }
        })
        //update last upadte
        root.querySelector(".table-refresh__label").textContent = `Last Update: ${new Date().toLocaleString()}`

        //stop rotate
        root.querySelector(".table-refresh__button").classList.remove("table-refresh__button--refreshing");

        //
        function reload () {
            $('#tableStock').DataTable({
                "language": {
                    "decimal": ",",
                    "thousands": "."
                },
                /*"scrollX": true */
            });
        }  
        reload();
    }




    for (const root of document.querySelectorAll('.table-refresh[data-url]')) {
        console.log(root);
        const table = document.createElement('table');
        table.setAttribute('id',"tableStock");
        table.setAttribute('data-show-columns',"true");
        table.setAttribute('data-show-columns-toggle-all',"true");
        table.setAttribute('class',"table table-striped table-bordered");


        const options = document.createElement('div');
        table.classList.add("table-refresh__table");
        //
        table.setAttribute('data-toggle',"table");
        options.classList.add("table-refresh__options");

        table.innerHTML = `
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td>Loading...</td>
                </tr>
            </tbody>
        `;
        options.innerHTML = `
            <span class="table-refresh__label">Last Update: never</span>
            <button type="button" class="table-refresh__button">
                <i class="material-icons">refresh</i>
            </button>
        `

        root.append(table, options); 

        options.querySelector('.table-refresh__button').addEventListener("click", () => {
            //updateTable(root);
            window.location.reload();
        });

        updateTable(root);
        
    }
    function updateMontant(){
        let value = parseFloat(document.getElementById('montant').value);
        let gainPercent = parseFloat(document.getElementById('gain').value.replace("%",""));
        let perteValue = parseFloat(document.getElementById('perte').value.replace("%",""));
        let stoploss = document.getElementById('stoploss');
                let takeprofit = document.getElementById('takeprofit');
        if (value>=0) {
            if (!isNaN(gainPercent) && !isNaN(perteValue)) {
                stoploss.value = Number.parseFloat(value*(100-perteValue)/100).toFixed(3);
                takeprofit.value = Number.parseFloat(value*(100+gainPercent)/100).toFixed(3);
            }
        } else {
            stoploss.value = "";
            takeprofit.value = "";
        }
    }
}