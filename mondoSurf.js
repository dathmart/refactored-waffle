// Buttons
let $county = $('#county_name');
let $latitude = $('#latitude');
let $longitude = $('#longitude');
let $spotId = $('#spot_id');
let $break = $('#spot_name');

// Forecast table
const $forecastTable = $('<table id="forecast"></table>');
const $forecastDiv = $('#showForecast');
const forecastTableHeaders = ['date', 'hour', 'shape_full', 'size_ft'];
const forecastColumnHeads = ['Date', 'Hour', 'Conditions', 'Swell height (ft)'];

// Spots table
const $spotsTable = $('<table id="spots"></table>');
const $container = $('#container');
const spotsTableHeaders = ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'];
const spotsColumnHeads = ['County', 'Latitude', 'Longitude', 'Spot ID', 'Break'];


$(document).ready(() => {
    
    initTable($forecastTable, forecastColumnHeads);
    $forecastDiv.append($forecastTable);

    initTable($spotsTable, spotsColumnHeads);
    
    $container.append($spotsTable);
    
    getSpots("http://localhost:8000/data");
    
});

const $search = $('#search');
$search.focus();
$search.blur(function () {
    const search = $search.val();
    if (!search) {
        return;
    }
    $tbody.empty();
    
    getSpots("http://localhost:8000/data?search=" + search);
});

setTimeout(() => {
    console.log('these are cool :D');
}, 2000);

function getForecast(spotId) {
    
    $.get(`http://www.spitcast.com/api/spot/forecast/${spotId}/`, data => {
        console.log(data);

        renderTable($forecastTable, data, forecastTableHeaders, keyCallback);
        
    });
};

function initTable ($table, columnHeads) {
    
    $table.attr("border", 2);
    
    const $thead = renderColumnHeads(columnHeads);
    
    $table.append($thead);
    
    const $tbody = $('<tbody></tbody>');
    $table.append($tbody);
    
};

// (1) Add dropdown to the page which limits the rows to 5, 10, or 15.
// As you change the selector it should limit the number of rows accordingly.


// (2) Add a dropdown to the page that allows you to select page 1, 2, or 3.
// As you change that selector, it should skip the right number of rows and take the..
// ...right number of rows, which is defined by your rows limit selector value.

function renderColumnHeads(columnHeads) {
    
    const $thead = $("<thead></thead>");
    const $trHead = $('<tr></tr>');
    
    columnHeads.forEach(head => {
        
        const $td = $('<td></td>');
        $td.append(`<td>${head}</td>`);
        const $th = $('<th></th>');
        $th.append($td)
        $trHead.append($th);
        
    });

    $thead.append($trHead);
    return $thead;
};

function renderTable($table, data, keys, keyCallback) {

    const $tbody = $($table).find('tbody');
    $tbody.empty();

    data.forEach(datum => {

        const $tr = $('<tr></tr>');
        $tbody.append($tr);
        keys.forEach(key => {

            const $td = $('<td></td>');
            const el = keyCallback(key, datum);

            $td.append(el || `<td>${datum[key]}</td>`);
            $tr.append($td);


        });

    });

};



function getSpots(url) {

    $.get(url, data => {

        renderTable($spotsTable, data,
            spotsTableHeaders,
            keyCallback = (key, datum) => {
                if (key == 'spot_id') {

                    return `<a onclick="getForecast(${datum[key]})" href="#${datum[key]}">${datum[key]}</a>`;

                }

            });

        let clickState = false;

        const doSort = sortProp => {

            sortMessage = '';

            if (!clickState) {
                clickState = true;
                sortMessage += "ascending";

            } else {
                clickState = false;
                sortMessage += "descending";

            }

            data.sort((a, b) => {
                let comparison = 0;

                if (typeof a[sortProp] === typeof b[sortProp]) {

                    comparison = a[sortProp] > b[sortProp] ? 1 : -1;
                }

                return clickState ? comparison : comparison * -1;
            });
        };

        $county.click(() => {
            doSort('county_name');
            renderTable($spotsTable, data, spotsTableHeaders, keyCallback);
            console.log(sortMessage + " by county")

        });

        $latitude.click(() => {
            doSort('latitude');
            renderTable($spotsTable, data, spotsTableHeaders, keyCallback);
            console.log(sortMessage + " by latitude")

        });

        $longitude.click(() => {
            doSort('longitude');
            renderTable($spotsTable, data, spotsTableHeaders, keyCallback);
            console.log(sortMessage + " by longitude")

        });

        $spotId.click(() => {
            doSort('spot_id');
            renderTable($spotsTable, data, spotsTableHeaders, keyCallback);
            console.log(sortMessage + " by spot id")

        });

        $break.click(() => {
            doSort('spot_name');
            renderTable($spotsTable, data, spotsTableHeaders, keyCallback);
            console.log(sortMessage + " by break")

        });


    });

};