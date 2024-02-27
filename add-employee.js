//dynamic profile starts here
document.getElementById('uploadButton').addEventListener('click', function () {
    document.getElementById('uploadInput').click();
});
document.getElementById('uploadInput').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgData = event.target.result;
            const imgElement = document.getElementById('profileImage');
            imgElement.src = imgData;
        }
        reader.readAsDataURL(file);
    }
});
//ends here




// Form validation starts here
var requiredFields = ['empno', 'fname', 'lname', 'email', 'joindt'];

requiredFields.forEach(function (fieldId) {
    document.getElementById(fieldId).addEventListener('input', function () {
        clearErrorMessage(fieldId);
    });
});

function clearErrorMessage(fieldId) {
    document.getElementById(fieldId + '-error').innerText = '';
}

function validateForm() {
    var empno = document.getElementById('empno').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var joindt = document.getElementById('joindt').value;
    var phone = document.getElementById('phone').value;
    var hasError = false; // Variable to track if any error occurred

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(function (element) {
        element.innerText = '';
    });

    // Validate each field
    if (empno === '') {
        document.getElementById('empno-error').innerText = 'Please enter Employee Number';
        hasError = true;
    } else {
        var empnoPattern = /^[a-zA-Z0-9]+$/;
        if (!empnoPattern.test(empno)) {
            document.getElementById('empno-error').innerText = 'Employee Number must contain only letters and numbers';
            hasError = true;
        }
    }

    if (fname === '') {
        document.getElementById('fname-error').innerText = 'Please enter First Name';
        hasError = true;
    } else {
        var fnamePattern = /^[a-zA-Z ]+$/;
        if (!fnamePattern.test(fname)) {
            document.getElementById('fname-error').innerText = 'First Name must contain only letters and spaces';
            hasError = true;
        }
    }

    if (lname === '') {
        document.getElementById('lname-error').innerText = 'Please enter Last Name';
        hasError = true;
    } else {
        // Regular expression for first name validation
        var lnamePattern = /^[a-zA-Z ]+$/;
        if (!lnamePattern.test(lname)) {
            document.getElementById('lname-error').innerText = 'Last Name must contain only letters and spaces';
            hasError = true;
        }
    }

    if (email === '') {
        document.getElementById('email-error').innerText = 'Please enter Email';
        hasError = true;
    } else {
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/;
        if (!emailPattern.test(email)) {
            document.getElementById('email-error').innerText = 'Email must contain only letters, numbers, @, .com';
            hasError = true;
        }
    }

    if (joindt === '') {
        document.getElementById('joindt-error').innerText = 'Please enter Joining Date';
        hasError = true;
    }


    var phonePattern = /^\d{10}$/;
    if (phone && !phonePattern.test(phone)) {
        document.getElementById('phone-error').innerText = 'Phone Number must contain only digits';
        hasError = true;
    }

    // If any error occurred, return without adding the employee
    if (hasError) {
        return;
    }
    addEmployee();
}
// Ends here




// Getting data from form and adding it into localStorage
function addEmployee() {
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var location = document.getElementById('location').value;
    var department = document.getElementById('department').value;
    var role = document.getElementById('role').value;
    var empno = document.getElementById('empno').value;
    var status = "Active";
    var joindt = document.getElementById('joindt').value;
    var dob = document.getElementById("dob").value;
    var phone = document.getElementById("phone").value;
    var image = document.getElementById("profileImage").src;
    var manager = document.querySelector(".managerName").value;
    var project = document.querySelector(".projectName").value;

    // Get existing employee data from local storage
    var employees = JSON.parse(localStorage.getItem('employees')) || [];

    var editEmployeeData = JSON.parse(localStorage.getItem('editEmployeeData'));
    if (editEmployeeData !== null) {
        var emp = editEmployeeData.index;
        var index = employees.findIndex(function (employee) {
            return employee.empno === emp;
        });
        employees.splice(index, 1);
        employees.push({ fname: fname, lname: lname, email: email, location: location, department: department, role: role, empno: empno, status: status, joindt: joindt, dob: dob, phone: phone, image: image, manager: manager, project: project });
        localStorage.setItem('employees', JSON.stringify(employees));
        localStorage.removeItem('editEmployeeData');
    }
    else {
        employees.push({ fname: fname, lname: lname, email: email, location: location, department: department, role: role, empno: empno, status: status, joindt: joindt, dob: dob, phone: phone, image: image, manager: manager, project: project });
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    var alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'block';

    setTimeout(function () {
        window.location.href = 'employees.html';
    }, 1000);
}
// Ends here




// Clears edit details from page when navigated to another page
function refresh() {
    var editEmployeeData = JSON.parse(localStorage.getItem('editEmployeeData'));
    localStorage.removeItem('editEmployeeData');
}
// Ends here




// Edit details starts here
document.addEventListener('DOMContentLoaded', function () {
    var editEmployeeData = JSON.parse(localStorage.getItem('editEmployeeData'));
    if (editEmployeeData) {
        document.getElementById('update-btn').innerHTML = "Update Employee";
        document.getElementById('empno').value = editEmployeeData.empno;
        document.getElementById('fname').value = editEmployeeData.fname;
        document.getElementById('lname').value = editEmployeeData.lname;
        document.getElementById('email').value = editEmployeeData.email;
        document.getElementById('joindt').value = editEmployeeData.joindt;
        document.getElementById('department').value = editEmployeeData.department;
        document.getElementById('location').value = editEmployeeData.location;
        document.getElementById('role').value = editEmployeeData.role;
        document.getElementById('dob').value = editEmployeeData.dob;
        document.getElementById('phone').value = editEmployeeData.phone;
        document.getElementById('profileImage').src = editEmployeeData.profile;
        document.querySelector(".managerName").value = editEmployeeData.managerName;
        document.querySelector(".projectName").value = editEmployeeData.projectName;

    }
});

window.addEventListener("unload", function (event) {
    var editEmployeeData = JSON.parse(localStorage.getItem('editEmployeeData'));
    localStorage.removeItem('editEmployeeData');
});
// Ends here