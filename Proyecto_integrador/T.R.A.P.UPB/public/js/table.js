$(document).ready(function() {
    $('#tabletest').DataTable( {
      "processing": true,
      "serverSide": true,
      "ajax": {
        "url": "/ver_trabajadores",
        "dataSrc": "peopleData"
      },
      "columns": [
        { "data" : "FirstName" },
        { "data" : "LastName" },
        { "data" : "EmailAddress" },
        { "data" : "FirstName" },
        { "data" : "LastName" },
        { "data" : "EmailAddress" }
      ]
    });
  });