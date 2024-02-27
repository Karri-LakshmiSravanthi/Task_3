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
        var addEmpRow = tableBody.insertRow();
        var rowCheckBox = addEmpRow.insertCell(0);
        rowCheckBox.class = "employee-checkbox";
        var name = addEmpRow.insertCell(1);
        name.classList.add('nameCell');
        var location = addEmpRow.insertCell(2);
        var dept = addEmpRow.insertCell(3);
        var role = addEmpRow.insertCell(4);
        var empno = addEmpRow.insertCell(5);
        var empStatus = addEmpRow.insertCell(6);
        var joinDt = addEmpRow.insertCell(7);
        var ellipsis = addEmpRow.insertCell(8);
        ellipsis.id = "ellipsisid";

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        rowCheckBox.appendChild(checkbox);
        name.innerHTML = `
            <div>
                <img src="${employee.image}" alt="Img" class="dynamicProfile">
            </div>
            <div class="userDetails">
                <span>${employee.fname}</span>
                <span>${employee.lname}</span>
                <p>${employee.email}</p>
            </div>
        `;
        location.innerHTML = employee.location;
        dept.innerHTML = employee.department;
        role.innerHTML = employee.role;
        empno.innerHTML = employee.empno;
        var button = document.createElement('button')
        button.innerHTML = "Active";
        button.classList.add('statusBtn');
        empStatus.appendChild(button);
        joinDt.innerHTML = employee.joindt;


        // Create a select element
        var actionSelection = document.createElement('select');
        actionSelection.id = 'mySelect';
        var actionOptions = [
            { text: '.....' },
            { text: 'Details', value: 'view details' },
            { text: 'Edit', value: 'edit' },
            { text: 'Delete', value: 'delete' }
        ];
        // Create and append option elements to the select element
        actionOptions.forEach(function (option) {
            ellipsisOptions = document.createElement('option');
            ellipsisOptions.textContent = option.text;
            ellipsisOptions.value = option.value;
            ellipsisOptions.style.borderRadius = "5px";
            ellipsisOptions.style.backgroundColor = 'white';
            actionSelection.appendChild(ellipsisOptions);

        });
        ellipsis.appendChild(actionSelection);
        // Changing background color of the ellipsis
        addEmpRow.addEventListener('mouseenter', function () {
            actionSelection.style.backgroundColor = 'rgb(250, 217, 217)';
        });
        addEmpRow.addEventListener('mouseleave', function () {
            actionSelection.style.backgroundColor = ''; // Revert to default
        });
        //Ends here

        actionSelection.addEventListener('change', function (event) {
            // Get the selected value
            var selectedAction = event.target.value;
            // Check if the selected value is 'delete'
            if (selectedAction === 'delete') {
                if (confirm("Are you sure, you want to delete this row?")) {
                    var selectedRow = actionSelection.closest('tr');
                    var emp = selectedRow.cells[5].textContent;
                    console.log(emp);
                    selectedRow.remove();
                    // // Remove corresponding data from local storage
                    var employees = JSON.parse(localStorage.getItem('employees')) || [];
                    var index = employees.findIndex(function (employee) {
                        return employee.empno === emp;
                    });
                    employees.splice(index, 1);
                    localStorage.setItem('employees', JSON.stringify(employees));
                }
            }

            if (selectedAction === 'edit') {
                var selectedRow = actionSelection.closest('tr');
                var emp = selectedRow.cells[5].textContent;
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
    var multiselectDropdowns = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdowns.forEach(function (dropdown) {
        if (dropdown.style.display === 'block' && !event.target.closest('.multiselect-dropdown')) {
            dropdown.style.display = 'none';
        }
    });
});

function toggleDropdown(selectBox) {
    var dropdownContent = selectBox.nextElementSibling;
    var multiselectDropdownsContent = document.querySelectorAll('.multiselect-dropdown-content');
    multiselectDropdownsContent.forEach(function (dropdown) {
        if (dropdown !== dropdownContent) {
            dropdown.style.display = 'none';
        }
    });
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

function updateSelectedItems(multiselectCheckbox) {
    var filterName = multiselectCheckbox.closest('.multiselect-dropdown').getAttribute('data-filter');

    var selectedItemsDisplay = multiselectCheckbox.closest('.multiselect-dropdown').querySelector('.selected');
    var selectedOptions = Array.from(multiselectCheckbox.closest('.multiselect-dropdown').querySelectorAll('input[type="checkbox"]:checked')).map(function (checkbox) {
        return checkbox.value;
    });
    selectedItemsDisplay.textContent = filterName + ': ' + (selectedOptions.length > 0 ? selectedOptions.length : '0') + ' selected';    filterarray[filterName] = selectedOptions;

    var filterButtons = document.getElementById('right-filter');
    filterButtons.classList.add('rightFilterbtns');  
}
//ends here  





// Filtering starts here
var employees = JSON.parse(localStorage.getItem('employees')) || [];
let filterarray = {
    Status: [],
    Department: [],
    Location: []
};

// Filtering based on buttons
var letterButtons = document.querySelectorAll(".letter-btn");
var previousButton = null;
letterButtons.forEach(function (button) {
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
        var filterImg = document.getElementById('filter-img');
        filterImg.style.color = "black";
    }
    else {
        document.getElementById('employeeList').innerHTML = "";
        var filterImg = document.getElementById('filter-img');
        filterImg.style.color = "red";
        addEmployees(results);
        var tableCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]');
        tableCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('click', function () {
                tableCheckboxListeners()
            });
        });
        tableHeadCheckbox();
    }
}
// Filtering Ends here




// Clearing the filter using reset button
function displayTable() {

    filterarray = {
        Status: [],
        Department: [],
        Location: []
    };

    buttonText = "";

    var filterButtons = document.getElementById('right-filter');
    filterButtons.style.display = "none";

    var filterImg = document.getElementById('filter-img');
    filterImg.style.color = "black";

    var tableHeader = document.querySelectorAll(".th-content");
    tableHeader.forEach(function (eachColumnHead) {
        var column = eachColumnHead.getAttribute('data-column');
        var sortOrder = sortOrders[column] || null;
        var icon = eachColumnHead.querySelector('.th-icons i');

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

    let letterButtonsBg = document.querySelectorAll(".letter-btn");
    letterButtonsBg.forEach(function (button) {
        button.style.backgroundColor = "";
        button.style.color = "black";
    });

    var selectedItemsDisplay = document.querySelectorAll('.multiselect-dropdown .selected');
    selectedItemsDisplay.forEach(function (display) {
        display.textContent = display.textContent.split(':')[0];
    });

    var multiselectCheckboxes = document.querySelectorAll('.multiselect-dropdown input[type="checkbox"]');
    multiselectCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });

}
// Ends here





// deleting multiple rows using checkboxes in the each row.
function deleteSelectedRows() {
    if (confirm("Are you sure, you want to delete the data?")) {
        var tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
        tBodyCheckboxes.forEach(function (checkbox) {
            if (checkbox.checked) {
                // Delete the row associated with the checked checkbox
                var selectedRow = checkbox.closest('tr');
                var emp = selectedRow.cells[5].textContent;
                selectedRow.remove();
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

// To display the delete button when checkboxes in the table were selected. 
function tableCheckboxListeners() {
    var tableCheckboxes = document.querySelectorAll('.table-wrapper input[type="checkbox"]');
    var deleteButton = document.getElementById('deleteButton');
    tableCheckboxes.forEach(function (checkbox) {
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
document.addEventListener('DOMContentLoaded', tableCheckboxListeners);


function tableHeadCheckbox() {
    var tHeadCheckbox = document.getElementById('selectAllCheckbox');
    var tBodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    tHeadCheckbox.addEventListener('click', function () {
        tBodyCheckboxes.forEach(function (checkbox) {
            checkbox.checked = tHeadCheckbox.checked;
        });
    });
}

document.addEventListener('DOMContentLoaded', tableHeadCheckbox);
// ends here





// Ascending and descending order filtering
var sortOrders = {};
document.addEventListener('DOMContentLoaded', function () {
    var theadColumns = document.querySelectorAll('.th-content');
    var sortOrders = {}; // Keep track of sort order for each column
    theadColumns.forEach(function (header) {
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

        tbody.innerHTML = '';

        rows.forEach(function (row) {
            tbody.appendChild(row);
        });

        // Toggle sort order for the current column
        sortOrders[column] = sortOrder === 'ascending' ? 'descending' : 'ascending';
        // Update font awesome icon based on sort order
        updateSortIcon(column, sortOrder);
    }

    function getColumnIndex(columnName) {
        var theadColumns = document.querySelectorAll('.th-content');
        for (var i = 0; i < theadColumns.length; i++) {
            if (theadColumns[i].getAttribute('data-column') === columnName) {
                return i + 1;
            }
        }
        return -1; // Column not found
    }

    function updateSortIcon(column, sortOrder) {
        var header = document.querySelector('.th-content[data-column="' + column + '"] .th-icons i');
        header.style.display = "none";

        if (sortOrder === 'ascending') {
            header.outerHTML = `<i class="fas fa-caret-up"></i>`;
            header.style.display = "block";
        } else {
            header.outerHTML = `<i class="fas fa-caret-down"></i>`;
            header.style.display = "block";
        }
    }
});





