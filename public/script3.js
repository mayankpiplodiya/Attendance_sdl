document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#studentTable tbody');

    // Function to fetch and display student data
    function fetchAndDisplayStudents() {
        fetch('http://localhost:3000/get_students')
        .then(response => {
            if (!response.ok) {
                throw new Error('Please upload the document to fetch the details. If not showing any option then check your network connection');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Check the structure and content

            // Clear the table before appending new data
            tableBody.innerHTML = '';

            // Populate the table with student data
            data.forEach(student => {
                const row = document.createElement('tr');

                // Convert and handle percentage value
                const percentageFloat = parseFloat(student.Percentage);
                const percent = !isNaN(percentageFloat) ? Math.round(percentageFloat) : 'N/A';

                row.innerHTML = `
                    <td>${student.Enrollement}</td>
                    <td>${student.Name}</td>
                    <td>${percent}%</td>
                `;

                // Check if attendance is below 75% and apply the 'low-attendance' class
                if (percent !== 'N/A' && percent < 75) {
                    row.classList.add('low-attendance');
                }

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load student data. Please try again later. Error: ' + error.message);
        });
    }

    // Fetch student data on page load
    fetchAndDisplayStudents();

    // Event listener for the Send SMS Messages button
    document.getElementById('sendSmsButton').addEventListener('click', function() {
        const enrollments = Array.from(document.querySelectorAll('#studentTable tbody tr'))
            .map(row => row.children[0].textContent); // Adjusted to get the Enrollment value from the first column

        fetch('http://localhost:3000/send_sms_messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ enrollments })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to send SMS messages');
            }
            return response.json();
        })
        .then(data => alert('SMS messages sent successfully!'))
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send SMS messages. Please try again later. Error: ' + error.message);
        });
    });

    // Event listener for the document upload
    document.getElementById('uploadButton').addEventListener('click', function() {
        const fileInput = document.getElementById('documentInput');
        const formData = new FormData();

        if (fileInput.files.length > 0) {
            formData.append('document', fileInput.files[0]);

            fetch('http://localhost:3000/upload_document', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to upload document');
                }
                return response.json();
            })
            .then(data => {
                alert('Document uploaded successfully!');
                // Fetch and display the updated student data
                fetchAndDisplayStudents();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to upload document. Please try again later. Error: ' + error.message);
            });
        } else {
            alert('Please select a document to upload.');
        }
    });
});
