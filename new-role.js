function searchFunc() {
    var currentDropdown = null; // Variable to keep track of the currently open dropdown
    var searchContainers = document.querySelectorAll('.sec');

    searchContainers.forEach(function (container) {
        var searchInput = container.querySelector('.managerName, .projectName');
        var dropdownContent = container.querySelector('.dropdown-content');
        var checkboxes = container.querySelectorAll('.option-checkbox');

        searchInput.addEventListener('click', function (event) {
            if (currentDropdown === dropdownContent) {
                dropdownContent.style.display = 'none';
                currentDropdown = null;
            } else {
                if (currentDropdown) {
                    currentDropdown.style.display = 'none';
                }
                dropdownContent.style.display = 'block';
                currentDropdown = dropdownContent; // Update the currently open dropdown
            }
            event.stopPropagation();
        });

        searchInput.addEventListener("input", function () {
            var input = this.value.trim().toUpperCase();
            var options = dropdownContent.querySelectorAll(".option");

            options.forEach(function (option) {
                var name = option.querySelector(".name").textContent.trim().toUpperCase();
                option.style.display = name.indexOf(input) > -1 ? "" : "none";
            });
        });

        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                var selectedNames = [];
                checkboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        var name = checkbox.closest('.option').querySelector('.name').textContent;
                        selectedNames.push(name);
                    }
                });
                searchInput.value = selectedNames.join(', ');
            });
        });
        dropdownContent.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent clicks within the dropdown from bubbling to body
        });
    });

    document.body.addEventListener('click', function (event) {
        // Close the currently open dropdown if the click is outside of any input field
        if (currentDropdown) {
            currentDropdown.style.display = 'none';
            currentDropdown = null; // Reset the currently open dropdown
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    searchFunc();
});
