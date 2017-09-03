let $county = $('#county_name');
let $latitude = $('#latitude');
let $longitude = $('#longitude');
let $spotId = $('#spot_id');
let $break = $('#spot_name');


const $table = $("<table></table>");
const $thead = $("<thead></thead>");
const $trHead = $("<tr></tr>");
const $th = $("<th></th>")


$table.attr("border", 2);
$table.append($thead);
$thead.append($trHead);
$trHead.append($th);
$th.text("County, Latitude, Longitude, Spot ID, Break");
$th.attr("colspan", 5);

const $tbody = $("<tbody></tbody>");
$table.append($tbody);

const getForecast = (spotId) => {
    $.get("http://api.spitcast.com/api/spot/forecast/" + spotId, function (data) {
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

    getTableData("http://localhost:8000/data?search=" + search);
});

function getTableData(url) {

    $.get(url, function (data) {

        var renderTableRows = () => {
            $tbody.empty();

            for (i = 0; i < data.length; i++) {
                const datum = data[i];

                const $tr = $("<tr></tr>");
                const $tdSpotId = $("<td></td>");
                $tbody.append($tr);
                $tr.append("<td>" + datum.county_name + "</td>");
                $tr.append("<td>" + datum.latitude + "</td>");
                $tr.append("<td>" + datum.longitude + "</td>");
                $tr.append($tdSpotId);

                $tdSpotId.append('<a onclick="getForecast(' + datum.spot_id + ')" '
                    + 'href="#' + datum.spot_id + '">' + datum.spot_id + '</a>');
                $tr.append("<td>" + datum.spot_name + "</td>");

            }

        };



        renderTableRows();
        console.log(event.target.click);

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
            renderTableRows();
            console.log(sortMessage + " by county")

        });

        $latitude.click(() => {
            doSort('latitude');
            renderTableRows();
            console.log(sortMessage + " by latitude")

        });

        $longitude.click(() => {
            doSort('longitude');
            renderTableRows();
            console.log(sortMessage + " by longitude")

        });

        $spotId.click(() => {
            doSort('spot_id');
            renderTableRows();
            console.log(sortMessage + " by spot id")

        });

        $break.click(() => {
            doSort('spot_name');
            renderTableRows();
            console.log(sortMessage + " by break")

        });


    });

};