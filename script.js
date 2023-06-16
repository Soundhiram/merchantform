const form = document.getElementById("regform");
const tableBody = document.querySelector("#result tbody");

let editRowIndex = -1;

window.addEventListener("DOMContentLoaded", function () {
  const savedData = JSON.parse(localStorage.getItem("formData"));
  if (savedData) {
    savedData.forEach((data) => {
      addRowToTable(data);
    });
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const website = document.getElementById("website").value;
  const contactName = document.getElementById("contact_name").value;
  const contactPhone = document.getElementById("contact_phone").value;
  const contactEmail = document.getElementById("contact_email").value;
  const notes = document.getElementById("notes").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const categoryOptions = document.getElementById("category").selectedOptions;
  const categories = Array.from(categoryOptions).map((option) => option.value);
  const commissionPercentage = document.getElementById(
    "commission_percentage"
  ).value;
  const activeFromDate = document.getElementById("active_from_date").value;
  const logo = document.getElementById("logo").value;
  const criticalAccount = document.getElementById("criticalaccount").checked;
  const paymentOptions = document.querySelectorAll(
    'input[name="paymentOptions"]:checked'
  );
  const selectedOptions = Array.from(paymentOptions).map(
    (option) => option.value
  );

  if (editRowIndex === -1) {
    const newData = {
      name,
      email,
      phone,
      website,
      contactName,
      contactPhone,
      contactEmail,
      notes,
      type,
      categories,
      commissionPercentage,
      activeFromDate,
      logo,
      criticalAccount,
      paymentOptions: selectedOptions,
    };

    addRowToTable(newData);
  } else {
    const editedRow = tableBody.rows[editRowIndex];

    const cells = editedRow.cells;

    cells[0].textContent = name;
    cells[1].textContent = email;
    cells[2].textContent = phone;
    cells[3].textContent = website;
    cells[4].textContent = contactName;
    cells[5].textContent = contactPhone;
    cells[6].textContent = contactEmail;
    cells[7].textContent = notes;
    cells[8].textContent = type;
    cells[9].textContent = categories.join(", ");
    cells[10].textContent = commissionPercentage;
    cells[11].textContent = activeFromDate;
    cells[12].textContent = logo;
    cells[13].textContent = criticalAccount ? "Yes" : "No";
    cells[14].textContent = selectedOptions.join(", ");

    editRowIndex = -1;
  }

  saveFormData();

  form.reset();
});

tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit-btn")) {
    const row = event.target.closest("tr");

    editRowIndex = Array.from(tableBody.rows).indexOf(row);

    const cells = row.cells;

    document.getElementById("name").value = cells[0].textContent;
    document.getElementById("email").value = cells[1].textContent;
    document.getElementById("phone").value = cells[2].textContent;
    document.getElementById("website").value = cells[3].textContent;
    document.getElementById("contact_name").value = cells[4].textContent;
    document.getElementById("contact_phone").value = cells[5].textContent;
    document.getElementById("contact_email").value = cells[6].textContent;
    document.getElementById("notes").value = cells[7].textContent;

    const typeRadios = document.querySelectorAll('input[name="type"]');
    typeRadios.forEach((radio) => {
      radio.checked = radio.value === cells[8].textContent;
    });

    const categorySelect = document.getElementById("category");
    const categoryOptions = categorySelect.options;
    Array.from(categoryOptions).forEach((option) => {
      option.selected = cells[9].textContent.includes(option.value);
    });

    document.getElementById("commission_percentage").value =
      cells[10].textContent;
    document.getElementById("active_from_date").value = cells[11].textContent;
    document.getElementById("logo").value = cells[12].textContent;
    document.getElementById("criticalaccount").checked =
      cells[13].textContent === "Yes";

    const paymentOptions = document.querySelectorAll(
      'input[name="paymentOptions"]'
    );
    paymentOptions.forEach((option) => {
      option.checked = cells[14].textContent.includes(option.value);
    });
  } else if (event.target.classList.contains("delete-btn")) {
    const row = event.target.closest("tr");

    tableBody.removeChild(row);

    saveFormData();
  }
});

function addRowToTable(data) {
  const newRow = tableBody.insertRow();

  newRow.innerHTML = `
    <td>${data.name}</td>
    <td>${data.email}</td>
    <td>${data.phone}</td>
    <td>${data.website}</td>
    <td>${data.contactName}</td>
    <td>${data.contactPhone}</td>
    <td>${data.contactEmail}</td>
    <td>${data.notes}</td>
    <td>${data.type}</td>
    <td>${data.categories.join(", ")}</td>
    <td>${data.commissionPercentage}</td>
    <td>${data.activeFromDate}</td>
    <td>${data.logo}</td>
    <td>${data.criticalAccount ? "Yes" : "No"}</td>
    <td>${data.paymentOptions.join(", ")}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </td>
  `;
}

function saveFormData() {
  const rows = Array.from(tableBody.rows);
  const formData = rows.map((row) => {
    const cells = row.cells;

    return {
      name: cells[0].textContent,
      email: cells[1].textContent,
      phone: cells[2].textContent,
      website: cells[3].textContent,
      contactName: cells[4].textContent,
      contactPhone: cells[5].textContent,
      contactEmail: cells[6].textContent,
      notes: cells[7].textContent,
      type: cells[8].textContent,
      categories: cells[9].textContent.split(", "),
      commissionPercentage: cells[10].textContent,
      activeFromDate: cells[11].textContent,
      logo: cells[12].textContent,
      criticalAccount: cells[13].textContent === "Yes",
      paymentOptions: cells[14].textContent.split(", "),
    };
  });

  localStorage.setItem("formData", JSON.stringify(formData));
}
