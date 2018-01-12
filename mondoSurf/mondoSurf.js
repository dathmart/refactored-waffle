// Buttons
const $county = $('#county_name'),
    $latitude = $('#latitude'),
    $longitude = $('#longitude'),
    $spotId = $('#spot_id'),
    $spotName = $('#spot_name'),
// Forecast table
    $forecastTable = $('<table id="forecast"></table>'),
    $forecastDiv = $('#showForecast'),
    forecastProps = ['date', 'hour', 'shape_full', 'size_ft'],
    forecastColumnHeads = ['Date', 'Hour', 'Conditions', 'Swell height (ft)'],
// Spots table
    $spotsTable = $('<table id="spotsTable"></table>', ),
    $container = $('#container'),
    spotsProps = ['county_name', 'latitude', 'longitude', 'spot_id', 'spot_name'],
    spotsColumnHeads = ['County', 'Latitude', 'Longitude', 'Spot ID', 'Spot Name'];

let page_size = $('#page_size').val(),
    page_number = $('#page_number').val(),
    spotsData = [];

const keyCallback = (key, datum) => {
    if (key == 'spot_id') {

        return `<a onclick="getForecast(${datum[key]})" href="#${datum[key]}">${datum[key]}</a>`;

    }

}

$(document).ready(() => {

    initTable($forecastTable, forecastColumnHeads);
    $forecastDiv.append($forecastTable);

    initTable($spotsTable, spotsColumnHeads);

    $container.append($spotsTable);

    $('#page_size').on('change', e => {
        console.log(`${e.target.value} rows per page`);
        page_size = parseInt(e.target.value);

        renderTable($spotsTable, spotsData, spotsProps, keyCallback);
    });

    $('#page_number').on('change', e => {
        console.log(`Page ${e.target.value}`);
        page_number = parseInt(e.target.value);

        renderTable($spotsTable, spotsData, spotsProps, keyCallback);

    });

    getSpots("http://localhost:8000/data");

});

const $search = $('#searchText');
$search.focus();

const doSearch = () => {
    const search = $search.val();
    if (!search) {
        window.alert("Please enter a search term");
    }

    const matched = spotsData.filter((datum, i) => {
        const spot_name = datum["spot_name"];
        return spot_name.includes(search);
    });

    const page_max = Math.ceil(matched.length / page_size);
    renderTable($spotsTable, matched, spotsProps, keyCallback);

};

$search.keydown(e => {
    if(e.which == 13) {
        e.preventDefault();
        doSearch();
    }

});

// $search.blur(() => {
//     const search = $search.val();
//     if (!search) {
//         window.alert("Please enter a search term");
//     }

//     const matched = spotsData.filter((datum, i) => {
//         const spot_name = datum["spot_name"];
//         return spot_name.includes(search);
//     });

//     // ** Make search include all props (instead of just spot_name)
    
//     // const matched = spotsData.filter(datum => {
//     //     spotsProps.forEach(prop => {
//     //         const el = datum[prop];
//     //     });

//     //     return el.includes(search);
//     // });

//     const page_max = Math.ceil(matched.length / page_size);
//     console.log(`Total pages: ${page_max}`);

//     // const $createSelect = opt => {
//     //     const $select = $('<select></select>');
            
//     // }

//     renderTable($spotsTable, matched, spotsProps, keyCallback);
// });


setTimeout(() => {
    console.log('these are cool :D');
}, 2000);

const getForecast = (spotId) => {

    $.get(`http://www.spitcast.com/api/spot/forecast/${spotId}/`, data => {
        console.log(data);

        renderTable($forecastTable, data, forecastProps, keyCallback);

    });
};

function initTable($table, columnHeads) {
    const $thead = renderColumnHeads(columnHeads),
        $tbody = $('<tbody></tbody>');

    $table.append($thead);
    $table.append($tbody); 

};

    const renderColumnHeads = columnHeads => {

    const $thead = $('<thead id="spotsHead"></thead>'),
        $trHead = $('<tr></tr>');

    columnHeads.forEach(head => {
        const $th = $('<th></th>');
        $th.text(head);
        $trHead.append($th);

    });

    $thead.append($trHead);
    return $thead;
};

function renderTable($table, data, keys, keyCallback) {

    const $tbody = $table.find('tbody');
    $tbody.empty();

    const filtered = data.filter((datum, i) => {
        const end = page_size * page_number,
             skip = end - page_size;

        return i < end && i >= skip;

    });

    // console.log(data.length, filtered.length);

    filtered.forEach(datum => {

        const $tr = $('<tr></tr>');
        $tbody.append($tr);
        keys.forEach(key => {

            const $td = $('<td></td>'),
                   el = keyCallback(key, datum);

            $td.html(el || datum[key]);
            $tr.append($td);

        });

    });

};

+function (_) {
    _.isRunning = `Underscore v. ${_.VERSION} is up and running`;
    console.log(_.isRunning);
}(_);

const surfModule = (function () {
    var exports = {};
    exports.spicoli = function () {
        console.log("All I need is some tasty waves, cool buds, and I'm fine.");
    };
    return exports;
}());


const getSpots = url => {

    $.get(url, data => {

        spotsData = data;

        renderTable($spotsTable, data,
            spotsProps,
            keyCallback);

        let clickState = false,
            sortMessage = '';

        const doSort = sortProp => {

            sortMessage = '';

            // clickState = {
            //     clicked: [true, false]
            // }

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

        $('#searchBtn').click(id => {
            
            doSort(this.val());
            renderTable();
            console.log();
        })

        $county.click(() => {
            doSort('county_name');
            renderTable($spotsTable, data, spotsProps, keyCallback);
            console.log(sortMessage + " by county")

        });

        $latitude.click(() => {
            doSort('latitude');
            renderTable($spotsTable, data, spotsProps, keyCallback);
            console.log(sortMessage + " by latitude")

        });

        $longitude.click(() => {
            doSort('longitude');
            renderTable($spotsTable, data, spotsProps, keyCallback);
            console.log(sortMessage + " by longitude")

        });

        $spotId.click(() => {
            doSort('spot_id');
            renderTable($spotsTable, data, spotsProps, keyCallback);
            console.log(sortMessage + " by spot id")

        });

        $spotName.click(() => {
            doSort('spot_name');
            renderTable($spotsTable, data, spotsProps, keyCallback);
            console.log(sortMessage + " by break")

        });

    });

};