// Exporting table details to a excel sheet
function exportToExcel() {
    var table = document.getElementById('myTable');

    // Clone the table to exclude images
    var tableClone = table.cloneNode(true);
    var images = tableClone.querySelectorAll('img');
    images.forEach(function (img) {
        img.parentNode.removeChild(img);
    });

    var html = tableClone.outerHTML;
    var url = 'data:application/vnd.ms-excel,' + encodeURIComponent(html);
    var link = document.createElement('a');
    link.download = 'EmployeeData.xls';
    link.href = url;
    link.click();
}
// Ends here





// employee details adding into table
function addEmployees(employees) {
    var tableBody = document.getElementById('employeeList');
    employees.forEach(function (employee, index) {
        var row = tableBody.insertRow();
        var chboxC = row.insertCell(0);
        chboxC.class = "employee-checkbox";
        var nameC = row.insertCell(1);
        nameC.classList.add('nameCell');
        var locationC = row.insertCell(2);
        var deptC = row.insertCell(3);
        var roleC = row.insertCell(4);
        var empnoC = row.insertCell(5);
        var btnC = row.insertCell(6);
        var joindtC = row.insertCell(7);
        var ellipsis = row.insertCell(8);
        ellipsis.id = "ellipsisid";

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        chboxC.appendChild(checkbox);
        nameC.innerHTML = `
            <div>
                <img src="${employee.image}" alt="Img" class="dynamicProfile">
            </div>
            <div class="userDetails">
                <span>${employee.fname}</span>
                <span>${employee.lname}</span>
                <p>${employee.email}</p>
            </div>
        `;
        locationC.innerHTML = employee.location;
        deptC.innerHTML = employee.department;
        roleC.innerHTML = employee.role;
        empnoC.innerHTML = employee.empno;
        var button = document.createElement('button')
        button.innerHTML = "Active";
        button.classList.add('statusBtn');
        btnC.appendChild(button);
        joindtC.innerHTML = employee.joindt;


        // Create a select element
        var selectElement = document.createElement('select');
        selectElement.id = 'mySelect';
        var options = [
            { text: '.....' },
            { text: 'Details', value: 'view details' },
            { text: 'Edit', value: 'edit' },
            { text: 'Delete', value: 'delete' }
        ];
        // Create and append option elements to the select element
        options.forEach(function (option) {
            optionElement = document.createElement('option');
            optionElement.textContent = option.text;
            optionElement.value = option.value;
            optionElement.style.borderRadius = "5px";
            optionElement.style.backgroundColor ='white';
            selectElement.appendChild(optionElement);

        });
        ellipsis.appendChild(selectElement);
        // Changing background color of the ellipsis
        row.addEventListener('mouseenter', function () {
            selectElement.style.backgroundColor = 'rgb(250, 217, 217)';
        });
        row.addEventListener('mouseleave', function () {
            selectElement.style.backgroundColor = ''; // Revert to default
        });
        //Ends here

        selectElement.addEventListener('change', function (event) {
            // Get the selected value
            var selectedValue = event.target.value;
            // Check if the selected value is 'delete'
            if (selectedValue === 'delete') {
                if (confirm("Are you sure, you want to delete this row?")) {
                    var row = selectElement.closest('tr');
                    var emp = row.cells[5].textContent;
                    console.log(emp);
                    row.remove();
                    // // Remove corresponding data from local storage
                    var employees = JSON.parse(localStorage.getItem('employees')) || [];
                    var index = employees.findIndex(function (employee) {
                        return employee.empno === emp;
                    });
                    employees.splice(index, 1);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
            }

            if (selectedValue === 'edit') {
                var row = selectElement.closest('tr');
                var emp = row.cells[5].textContent;
                const rowData = {
                    empno: employee.empno,
                    fname: employee.fname,
                    lname: employee.lname,
                    email: employee.email,
                    location: employee.location,
                    department: employee.department,
                    role: employee.role,
                    joindt: employee.joindt,
                    dob: employee.dob,
                    phone: employee.phone,
                    profile: employee.image,
                    managerName: employee.manager,
                    projectName: employee.project,
                    index: emp
                };
                localStorage.setItem('editEmployeeData', JSON.stringify(rowData));
                window.location.href = 'add-employee.html';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    var employees = JSON.parse(localStorage.getItem('employees')) || [];
    addEmployees(employees);
});
// Ends here




// Multi select dropdown starts here
document.body.addEventListener('click', function (event) {
    var dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(function (dropdown) {
        if (dropdown.style.display === 'block' && !event.target.closest('.multiselect')) {
            dropdown.style.display = 'none';
        }
    });
});

function toggleDropdown(selectBox) {
    var dropdownContent = selectBox.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

function updateSelectedItems(checkbox) {
    var selectedItemsDisplay = checkbox.closest('.multiselect').querySelector('.selected');
    var selectedOptions = Array.from(checkbox.closest('.multiselect').querySelectorAll('input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    var name = selectedItemsDisplay.textContent.match(/\S+/)[0];
    var countText = (selectedOptions.length > 0 ? selectedOptions.length.toString() + ' selected' : '0 selected');
    selectedItemsDisplay.textContent = name + ': ' + countText;
}
//ends here  





// Filtering based on dropdowns
var employees = JSON.parse(localStorage.getItem('employees')) || [];
let filterarray = {
    Status: [],
    Department: [],
    Location: []
};
function updateSelectedItems(checkbox) {
    var value = checkbox.value;
    var filterName = checkbox.closest('.multiselect').getAttribute('data-filter');
    var selectedItemsDisplay = checkbox.closest('.multiselect').querySelector('.selected');
    var selectedOptions = Array.from(checkbox.closest('.multiselect').querySelectorAll('input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    selectedItemsDisplay.textContent = filterName + ': ' + (selectedOptions.length > 0 ? selectedOptions.length : '0') + ' selected';
    filterarray[filterName] = selectedOptions;
    console.log(filterarray);
    var fillbtn = document.getElementById('right-filter');
    fillbtn.classList.add('rightFilterbtns');
    fillbtn.style.display = "flex";
    fillbtn.style.justifyContent = "flex-end";
}




// Filtering based on buttons
var buttons = document.querySelectorAll(".letter-btn");
var previousButton = null;
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        buttonText = button.innerText;
        // Restore styles of the previously clicked button
        if (previousButton !== null) {
            previousButton.style.backgroundColor = "";
            previousButton.style.color = "";
        }
        button.style.backgroundColor = "rgb(249, 23, 23)";
        button.style.color = 'white';
        // Update the previousButton variable to the currently clicked button
        previousButton = button;

        displayresult();
    });
});
// Ends here



var startsWithLetter;
var statusMatch = [];
var locationMatch = [];
var departmentMatch = [];
var buttonText = "";
function displayresult() {
    let results = employees.filter(ele => {
        let name = ele.fname.toUpperCase();
        startsWithLetter = buttonText == "" || name.startsWith(buttonText);
        statusMatch = filterarray.Status.length === 0 || filterarray.Status.includes(ele.status);
        locationMatch = filterarray.Location.length === 0 || filterarray.Location.includes(ele.location);
        departmentMatch = filterarray.Department.length === 0 || filterarray.Department.includes(ele.department);
        return startsWithLetter && statusMatch && departmentMatch && locationMatch;
    });

    if (results.length == 0) {
        document.getElementById('employeeList').innerHTML = "<tr><td colspan='6'>No matches found</td></tr>";
    }
    else {
        document.getElementById('employeeList').innerHTML = "";
        console.log(results);
        addEmployees(results);
        var checkboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('click', function () {
                setupCheckboxListeners()
            });
        });
        handleSelectAllCheckbox();
    }
}
//Ends here




// Clearing the filter using reset button
function displayTable() {

    filterarray = {
        Status: [],
        Department: [],
        Location: []
    };

    buttonText = "";

    var fillbtn = document.getElementById('right-filter');
    fillbtn.style.display = "none";

    var filterI = document.getElementById('filter-i');
    filterI.style.color = "black";

    var tableHeader = document.querySelectorAll(".th-content");
    tableHeader.forEach(function (header) {
        var column = header.getAttribute('data-column');
        var sortOrder = sortOrders[column] || null;
        var icon = header.querySelector('.th-icons i');

        if (sortOrder === 'ascending') {
            icon.className = 'fas fa-caret-up';
        } else if (sortOrder === 'descending') {
            icon.className = 'fas fa-caret-down';
        } else {
            icon.className = 'fas fa-sort';
        }
    });

    document.getElementById('employeeList').innerHTML = "";
    addEmployees(employees);

    let buttonsBg = document.querySelectorAll(".letter-btn");
    buttonsBg.forEach(function (button) {
        button.style.backgroundColor = "";
        button.style.color = "black";
    });

    var selectedItemsDisplay = document.querySelectorAll('.multiselect .selected');
    selectedItemsDisplay.forEach(function (display) {
        display.textContent = display.textContent.split(':')[0];
    });

    var checkboxes = document.querySelectorAll('.multiselect input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

}
// Ends here





// deleting multiple rows using checkboxes in the each row.

function deleteSelectedRows() {
    if (confirm("Are you sure, you want to delete the data?")) {
        var checkboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        checkboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                // Delete the row associated with the checked checkbox
                var row = checkbox.closest('tr');
                var emp = row.cells[5].textContent;
                row.remove();
                // Remove corresponding data from local storage
                var employees = JSON.parse(localStorage.getItem('employees')) || [];
                var index = employees.findIndex(function (employee) {
                    return employee.empno === emp;
                });
                employees.splice(index, 1);
                localStorage.setItem('employees', JSON.stringify(employees));
            }
        });
    }
}

// To display the delete button 
function setupCheckboxListeners() {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var deleteButton = document.getElementById('deleteButton');

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            var checkedCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]:checked');
            if (checkedCheckboxes.length > 0) {
                deleteButton.style.display = 'block';
            } else {
                deleteButton.style.display = 'none';
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', setupCheckboxListeners);

function handleSelectAllCheckbox() {
    var selectAllCheckbox = document.getElementById('selectAllCheckbox');
    var tbodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');

    selectAllCheckbox.addEventListener('click', function () {
        tbodyCheckboxes.forEach(function (checkbox) {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });
}

document.addEventListener('DOMContentLoaded', handleSelectAllCheckbox);
// ends here





// Ascending and descending order filtering
var sortOrders = {};
document.addEventListener('DOMContentLoaded', function () {
    var headers = document.querySelectorAll('.th-content');
    var sortOrders = {}; // Keep track of sort order for each column
    headers.forEach(function (header) {
        header.addEventListener('click', function () {
            var column = header.getAttribute('data-column');
            sortTable(column);
        });
    });

    function sortTable(column) {
        var sortOrder = sortOrders[column] || 'ascending'; // Get current sort order or default to 'ascending'
        var table = document.getElementById('myTable');
        var tbody = table.querySelector('tbody');
        var rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort(function (rowA, rowB) {
            var cellA = rowA.querySelector('td:nth-child(' + (getColumnIndex(column) + 1) + ')').textContent;
            var cellB = rowB.querySelector('td:nth-child(' + (getColumnIndex(column) + 1) + ')').textContent;

            return sortOrder === 'ascending' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        tbody.innerHTML = ''; // Clear the tbody

        rows.forEach(function (row) {
            tbody.appendChild(row);
        });

        // Toggle sort order for the current column
        sortOrders[column] = sortOrder === 'ascending' ? 'descending' : 'ascending';

        // Update font awesome icon based on sort order
        updateSortIcon(column, sortOrder);
    }

    function getColumnIndex(columnName) {
        var headers = document.querySelectorAll('.th-content');
        for (var i = 0; i < headers.length; i++) {
            if (headers[i].getAttribute('data-column') === columnName) {
                return i + 1;
            }
        }
        return -1; // Column not found
    }

    function updateSortIcon(column, sortOrder) {
        var header = document.querySelector('.th-content[data-column="' + column + '"] .th-icons i');
        header.style.display = "none";

        // Add appropriate font awesome class based on sort order
        if (sortOrder === 'ascending') {
            header.outerHTML = `<i class="fas fa-caret-up"></i>`;
            header.style.display = "block";
        } else {
            header.outerHTML = `<i class="fas fa-caret-down"></i>`;
            header.style.display = "block";
        }
    }
});





