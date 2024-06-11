const weekSelect = document.getElementById("week-select");
const playersTable = document.querySelector(".players-list-table");
const refBody = document.querySelector('.players-list-table tbody')

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector('#ref-table tbody');

  fetch(`https://flms-backend.onrender.com/referee`) // Construct the API URL using the value
            .then(response => response.json())
            .then(players => {
                tableBody.innerHTML = ""; 

                players.forEach(player => {
                  // 1. Create Table Row
                  const row = tableBody.insertRow();
                
                  // 2. Format and Insert Data
                  const dataToInsert = [
                    player.ref_id, 
                    player.ref_name
                  ];
                
                  dataToInsert.forEach(data => {
                    const cell = row.insertCell();
                    cell.textContent = data;
                  });
                });
                
            })
            .catch(error => {
                console.error("Error fetching players:", error);
                tableBody.innerHTML = `<tr><td colspan="6">Error loading players</td></tr>`;
            });

  const addPlayerModal = document.getElementById("addPlayerModal");
  const addPlayerBtn = document.querySelector(".add-player");
  const closeBtn = document.querySelector(".close-button");
  const addPlayerForm = document.getElementById("addPlayerForm");

  // Event listeners for opening and closing the modal
  addPlayerBtn.addEventListener("click", () => {
      addPlayerModal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
      addPlayerModal.style.display = "none";
  });

  // Handle form submission
  addPlayerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Gather form data 
      const ref_id = document.getElementById("playerID").value;
      const ref_name = document.getElementById("event").value;
      


      // Prepare data to send to the API
      const playerData = {
        ref_id: ref_id,
        ref_name: ref_name
      };

      // Send the player data to the API
      fetch(`https://flms-backend.onrender.com/referee`, { 
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(playerData)
      })

      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          return response.text(); 
      })

      .then(data => {
          console.log(data); 

          addPlayerModal.style.display = "none"; 
          updatePlayerList();  // Update the player list after adding
      })
      .catch(error => {
          console.error('Error adding player:', error); 
      });
  });

  const deletePlayerModal = document.getElementById("deletePlayerModal");
  const deletePlayerBtn = document.querySelector(".delete-player");
  const closeBtn2 = document.querySelector(".close-button");
  const deletePlayerForm = document.getElementById("deletePlayerForm");

  // Event listeners for opening and closing the modal
  deletePlayerBtn.addEventListener("click", () => {
      deletePlayerModal.style.display = "block";
  });

  closeBtn2.addEventListener("click", () => {
      deletePlayerModal.style.display = "none";
  });

  // Handle form submission
  deletePlayerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Gather form data 
      const ref_id = document.getElementById("clubName2").value;

      // Send the player data to the API
      fetch(`https://flms-backend.onrender.com/referee/${ref_id}`, { 
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok.');
          }
          return response.text(); 
      })
      .then(data => {
          console.log(data); 

          deletePlayerModal.style.display = "none"; 
          updatePlayerList();  // delete the player list after adding
      })
      .catch(error => {
          console.error('Error adding player:', error); 
      });
  });

    weekSelect.addEventListener("change", async (event) => {
        const random = document.querySelector(".random");
      const selectedWeek = event.target.value;
      if (selectedWeek) {
        playersTable.style.display = "table";
        random.style.display = "flex";

        fetch(`https://flms-backend.onrender.com/referee/schedule/${selectedWeek}`) // Construct the API URL using the value
            .then(response => response.json())
            .then(players => {
                refBody.innerHTML = ""; 

                players.forEach(player => {
                  // 1. Create Table Row
                  const row = refBody.insertRow();
                
                  // 2. Format and Insert Data
                  const dataToInsert = [
                    player.ref_id, 
                    player.ref_name, 
                    player.match_id,
                    new Date(player.match_time,).toLocaleString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Ho_Chi_Minh', // Or 'ICT' for Indochina Time
                      }), 
                    player.stadium_name,
                  ];
                
                  dataToInsert.forEach(data => {
                    const cell = row.insertCell();
                    cell.textContent = data;
                  });
                });
                
            })
            .catch(error => {
                console.error("Error fetching players:", error);
                refBody.innerHTML = `<tr><td colspan="6">Error loading players</td></tr>`;
            });
      } else {
        matchMenu.style.display = "none";
        clearAndHideTable(playersTable, playersTbody, playersHeader);
        clearAndHideTable(coachesTable, coachesTbody, coachesHeader);
      }
    });

    //////
    const matchSelect = document.getElementById("match-select");
    const playersTable = document.querySelector('.players-list-table');
    const eventLog = document.querySelector('.random');
    const matchResultDiv = document.getElementById('match-result');

    matchSelect.addEventListener('change', () => {
    const selectedMatchId = matchSelect.value;

    if (selectedMatchId) {
        // Show the tables
        playersTable.style.display = "table";
        eventLog.style.display = "flex";


        // Fetch Players Data
        fetch(`https://flms-backend.onrender.com/fixtures/event/${selectedMatchId}`)
            .then(response => response.json())
            .then(players => {
                const playerTableBody = document.getElementById("player-table-body");
                playerTableBody.innerHTML = ""; // Clear existing rows
                
                let startEventFound = false; // Flag to track if we've found the "start" event
                let eventHalfFound = false; // Flag to track if we've found the "start" event

                players.forEach(player => {
                    const row = playerTableBody.insertRow();
                    row.insertCell().textContent = player.club_name;
                    row.insertCell().textContent = player.player_id !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.player_name !== null ? player.player_name : "N/A";
                    row.insertCell().textContent = player.event;
                    row.insertCell().textContent = player.event_half !== null ? player.event_half : "N/A";
                    row.insertCell().textContent = player.event_time !== null ? player.event_time : "N/A";
                    // Add more cells for other player attributes if needed

                    if (!startEventFound && player.event === "start") {
                        row.classList.add("start-event-row");
                        startEventFound = true; 
                    }
                    if (!eventHalfFound && player.event_half === 2) {
                        row.classList.add("two-half-row");
                        eventHalfFound = true; 
                    }
                });            
            });

        } else {
            // Hide the tables if no match is selected
            playersTable.style.display = 'none';
        }
    });

    // 2. Handle dropdown selection change
    matchSelect.addEventListener('change', () => {
        const selectedMatchId = matchSelect.value;
        if (selectedMatchId) {
            matchResultDiv.style.display = "flex";
            fetch(`https://flms-backend.onrender.com/fixtures/result/${selectedMatchId}`)
                .then(response => response.json())
                .then(result => {
                    // 3. Display the match result (customize this part)
                    matchResultDiv.innerHTML = `
    <div class=random2>${result[0].team1} ${result[0].goal1} - ${result[0].goal2} ${result[0].team2}</div>
`; 

                })
                .catch(error => {
                    console.error('Error fetching match result:', error);
                    matchResultDiv.textContent = 'Error loading results.'; // Display error
                });
        } else {
            matchResultDiv.innerHTML = ''; // Clear results if nothing is selected
        }
    });


    const addPlayerModal1 = document.getElementById("addPlayerModal1");
    const addPlayerBtn1 = document.querySelector(".add-player1");
    const closeBtn1 = document.querySelector(".close-button1");
    const addPlayerForm1 = document.getElementById("addPlayerForm1");

    // Event listeners for opening and closing the modal
    addPlayerBtn.addEventListener("click", () => {
        addPlayerModal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        addPlayerModal.style.display = "none";
    });

    // Handle form submission
    addPlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Gather form data 
        const match_id = matchSelect.value;
        const playerID = parseInt(document.getElementById("playerID").value);
        const _event = document.getElementById("event").value;
        const event_half = parseInt(document.getElementById("eventHalf").value);
        const event_time = parseInt(document.getElementById("eventTime").value);


        // Prepare data to send to the API
        const playerData = {
            match_id: matchSelect.value,
            player_id: playerID,
            _event: _event,
            event_half: event_half,
            event_time: event_time
        };

        // Send the player data to the API
        fetch(`https://flms-backend.onrender.com/fixtures/event`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(playerData)
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text(); 
        })

        .then(data => {
            console.log(data); 

            addPlayerModal.style.display = "none"; 
            updatePlayerList(matchSelect);  // Update the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });

    const deletePlayerModal3 = document.getElementById("deletePlayerModal3");
    const deletePlayerBtn3 = document.querySelector(".delete-player3");
    const closeBtn3 = document.querySelector(".close-button3");
    const deletePlayerForm3 = document.getElementById("deletePlayerForm3");
  
    // Event listeners for opening and closing the modal
    deletePlayerBtn.addEventListener("click", () => {
        deletePlayerModal.style.display = "block";
    });
  
    closeBtn2.addEventListener("click", () => {
        deletePlayerModal.style.display = "none";
    });
  
    // Handle form submission
    deletePlayerForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        // Gather form data 
        const match_id = matchSelect.value;
        const playerID = parseInt(document.getElementById("playerID2").value);
        const clubName = document.getElementById("clubName2").value
        const _event = document.getElementById("event2").value;
        const event_half = parseInt(document.getElementById("eventHalf2").value);
        const event_time = parseFloat(document.getElementById("eventTime2").value);
  
        // Send the player data to the API
        fetch(`https://flms-backend.onrender.com/fixtures/event/${match_id}/${playerID}/${_event}/${event_half}/${event_time}`, { 
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text(); 
        })
        .then(data => {
            console.log(data); 
  
            deletePlayerModal.style.display = "none"; 
            updatePlayerList(matchSelect);  // delete the player list after adding
        })
        .catch(error => {
            console.error('Error adding player:', error); 
        });
    });
});
    

function updateRefMatchList(matchweek) {
    const selectedMatchId = matchSelect.value;
    const selectedWeek = document.getElementById("week-select").value; 
    const matchResultDiv = document.getElementById('match-result');

    if (selectedMatchId) {
        // Show the tables
        playersTable.style.display = 'table';

        // Fetch Players Data
        fetch(`https://flms-backend.onrender.com/fixtures/event/${selectedMatchId}`)
            .then(response => response.json())
            .then(players => {
                const playerTableBody = document.getElementById("player-table-body");
                playerTableBody.innerHTML = ""; // Clear existing rows
                
                let startEventFound = false; // Flag to track if we've found the "start" event
                let eventHalfFound = false; // Flag to track if we've found the "start" event

                players.forEach(player => {
                    const row = playerTableBody.insertRow();
                    row.insertCell().textContent = player.club_name;
                    row.insertCell().textContent = player.player_id !== null ? player.player_id : "N/A";
                    row.insertCell().textContent = player.player_name !== null ? player.player_name : "N/A";
                    row.insertCell().textContent = player.event;
                    row.insertCell().textContent = player.event_half !== null ? player.event_half : "N/A";
                    row.insertCell().textContent = player.event_time !== null ? player.event_time : "N/A";
                    // Add more cells for other player attributes if needed

                    if (!startEventFound && player.event === "start") {
                        row.classList.add("start-event-row");
                        startEventFound = true; 
                    }
                    if (!eventHalfFound && player.event_half === 2) {
                        row.classList.add("two-half-row");
                        eventHalfFound = true; 
                    }
                });
                        
            });
            fetch(`https://flms-backend.onrender.com/fixtures/result/${selectedMatchId}`)
                .then(response => response.json())
                .then(result => {
                    // 3. Display the match result (customize this part)
                    matchResultDiv.innerHTML = `
                <div class=random2>${result[0].team1} ${result[0].goal1} - ${result[0].goal2} ${result[0].team2}</div>
`; 

            });
            
    }
}









  

