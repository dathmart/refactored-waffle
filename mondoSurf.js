let $county = $('#county_name');
let $latitude = $('#latitude');
let $longitude = $('#longitude');
let $spotId = $('#spot_id');
let $break = $('#spot_name');

const $forecastTable = $('<table id="forecast"></table>');
const $spotsTable = $('<table id="spots"></table>');
const spotsTableHeaders = ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'];

$(document).ready(() => {

    $spotsTable.attr("border", 2);
    const $thead = $("<thead></thead>");
    $spotsTable.append($thead);
    const $trHead = $("<tr></tr>");
    const $th = $("<th></th>");
    $thead.append($trHead);
    $trHead.append($th);
    $th.text("County, Latitude, Longitude, Spot ID, Break");
    $th.attr("colspan", 5);
    const $tbody = $('<tbody></tbody>');
    $spotsTable.append($tbody);

    var $container = $('#container');

    $container.append($spotsTable);

    getSpots("http://localhost:8000/data");

    const $search = $("#search");
    $search.focus();
    $search.blur(() => {
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
});


function getForecast(spotId) {

    $.get(`http://www.spitcast.com/api/spot/forecast/${spotId}/`, data => {
        console.log(data);

    });

}


function renderTable($table, data, keys, keyCallback) {

    const $tbody = $('tbody').first();
    $tbody.empty();

    data.forEach(datum => {

        const $tr = $('<tr></tr>');
        $tbody.append($tr);

        keys.forEach(key => {

            const $td = $("<td></td>");

            const el = keyCallback(key, datum);

            $td.append(el || `<td>${datum[key]}</td>`);
            
            $tr.append($td);
        });

    });

};

// renderTable($forecastTable, ['date', 'hour', 'shape_detail.swell', 'size']);

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