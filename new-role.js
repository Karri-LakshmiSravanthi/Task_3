function searchFunction() {
    var currentDropdown = null; // Variable to keep track of the currently open dropdown
    var searchContainers = document.querySelectorAll('.searchDropdown');

    searchContainers.forEach(function (container) {
        var searchField = container.querySelector('.managerName, .projectName');
        var searchFieldDropdownContent = container.querySelector('.dropdown-content');
        var optionCheckboxes = container.querySelectorAll('.option-checkbox');

        searchField.addEventListener('click', function (event) {
            if (currentDropdown === searchFieldDropdownContent) {
                searchFieldDropdownContent.style.display = 'none';
                currentDropdown = null;
            } else {
                if (currentDropdown) {
                    currentDropdown.style.display = 'none';
                }
                searchFieldDropdownContent.style.display = 'block';
                currentDropdown = searchFieldDropdownContent; // Update the currently open dropdown
            }
            event.stopPropagation();
        });

        searchField.addEventListener("input", function () {
            var input = this.value.trim().toUpperCase();
            var options = searchFieldDropdownContent.querySelectorAll(".option");

            options.forEach(function (option) {
                var name = option.querySelector(".name").textContent.trim().toUpperCase();
                option.style.display = name.indexOf(input) > -1 ? "" : "none";
            });
        });

        optionCheckboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                var selectedNames = [];
                optionCheckboxes.forEach(function (checkbox) {
                    if (checkbox.checked) {
                        var name = checkbox.closest('.option').querySelector('.name').textContent;
                        selectedNames.push(name);
                    }
                });
                searchField.value = selectedNames.join(', ');
            });
        });
        searchFieldDropdownContent.addEventListener('click', function (event) {
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
    searchFunction();
});
