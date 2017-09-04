let $county = $('#county_name');
let $latitude = $('#latitude');
let $longitude = $('#longitude');
let $spotId = $('#spot_id');
let $break = $('#spot_name');

const $forecastTable = $('<table id="forecast"></table>');
const $spotsTable = $('<table id="spots"></table>');

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

});


const getForecast = (spotId) => {
    $.get(`http://www.spitcast.com/api/spot/forecast/${spotId}/`, function (data) {
        console.log(data);

    });

}

setTimeout(function () {
}, 2000);

const $search = $("#search");
$search.focus();
$search.blur(function () {
    const search = $search.val();
    if (!search) {
        return;
    }
    $tbody.empty();

    getSpots("http://localhost:8000/data?search=" + search);
});

var renderTable = ($table, data, keys, keyCallback) => {

    const $tbody = $('tbody').first();
    $tbody.empty();

    data.forEach((datum) => {

        const $tr = $('<tr></tr>');
        $tbody.append($tr);
        keys.forEach((key) => {

            const $td = keyCallback(key, datum);
            if ($td) {
                $tr.append($td);

            } else {
                $tr.append(`<td>${datum[key]}</td>`);
            }
        });

    });

};

// renderTable($forecastTable, ['date', 'hour', 'shape_detail.swell', 'size']);

function getSpots(url) {

    $.get(url, function (data) {

        renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback = (key, datum) => {
            if (key == 'spot_id') {

                const $td = $("<td></td>");
                $td.append(`<a onclick="getForecast(${datum[key]})" href="#${datum[key]}">${datum[key]}</a>`);
                return $td;

            }

        });

        let clickState = false;

        var doSort = (sortProp) => {

            sortMessage = '';

            if (clickState == false) {
                clickState = true;
                sortMessage += "ascending";

            } else if (clickState == true) {
                clickState = false;
                sortMessage += "descending";

            }

            data.sort((a, b) => {

                if (a[sortProp] === b[sortProp]) {
                    let comparison = 0;
                }
                if (typeof a[sortProp] === typeof b[sortProp]) {
                    a[sortProp] > b[sortProp] ? comparison = 1 : comparison = -1;
                }

                if (clickState == true) {
                    return comparison;
                } else {
                    return comparison * -1;
                }

            });
        };

        $county.click(() => {
            doSort('county_name');
            renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback);
            console.log(sortMessage + " by county")

        });

        $latitude.click(() => {
            doSort('latitude');
            renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback);
            console.log(sortMessage + " by latitude")

        });

        $longitude.click(() => {
            doSort('longitude');
            renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback);
            console.log(sortMessage + " by longitude")

        });

        $spotId.click(() => {
            doSort('spot_id');
            renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback);
            console.log(sortMessage + " by spot id")

        });

        $break.click(() => {
            doSort('spot_name');
            renderTable($spotsTable, data, ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'], keyCallback);
            console.log(sortMessage + " by break")

        });


    });

};