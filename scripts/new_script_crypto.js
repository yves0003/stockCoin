{
    async function updateTable(root){
        root.querySelector(".table-refresh__button").classList.add("table-refresh__button--refreshing");
        const table = root.querySelector(".table-refresh__table");
        const response = await fetch(root.dataset.url);
        const data = await response.json();
        //clear table
        table.querySelector('thead tr').innerHTML="";
        table.querySelector('tbody').innerHTML="";
        
        //populate rows
        for(const row of data.rows){
            table.querySelector('tbody').insertAdjacentHTML("beforeend",`
                <tr>
                    ${row.map((col,index) => {
                        if (index==0) {
                            return `<td><a href="https://trade.kraken.com/fr-fr/charts/KRAKEN:${col.replace("EUR","")}-EUR?period=15m" target="_blank">${col}</a></td>`;
                        } else {
                            if (!isNaN(col.replace(" ","").replace(",",".").replace("%",""))) {
                                if (parseFloat(col.replace(" ","").replace(",",".").replace("%",""))>=0) {
                                    return `<td class="green-text">${col}</td>`;
                                }else {
                                    return `<td class="red-text">${col}</td>`;
                                }
                            } else {
                                return `<td>${col}</td>`;
                            }
                        }
                    }).join("")}
                </tr>
            `);
        }

        //populate header
        data.entetes.forEach((header,index) => {
            table.querySelector('thead tr').insertAdjacentHTML("beforeend",`<th>${header}</th>`);
        })
        //update last date
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

    function updateMontant(e){
        let value = parseFloat(e.value.replace(",","."));
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