const docsModule = require('./docs');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

function newStageList(editableTable, stageList) {
    [...editableTable.rows].slice(1).forEach((row, index) => {
        if (stageList[index].age) {
        stageList[index].age[0] = row.cells[0].textContent;
        } else {
        stageList[index].age = [row.cells[0].textContent];
        }
        stageList[index].staName = row.cells[1].textContent;
        stageList[index].debut = row.cells[2].textContent;
        stageList[index].fin = row.cells[3].textContent;
        stageList[index].salle1 = row.cells[4].textContent;
        stageList[index].salle2 = row.cells[5].textContent;
        if (stageList[index].prof1) {
          stageList[index].prof1.nom = row.cells[6].textContent;
        }
        if (stageList[index].prof2) {
          stageList[index].prof2.nom = row.cells[7].textContent;
        }
        stageList[index].commentaire = row.cells[8].textContent;
    });
      return stageList;
}

function generateEditableTable(stageLists) {
    const stageList = docsModule.sortStage(stageLists);

    const table = document.createElement('table');
    table.className = 'editable-table';
  
    const headerRow = document.createElement('tr');
    const headers = ['Age', 'Intitulé', 'début', 'fin', 'salle1', 'salle2', 'prof1', 'prof2', 'commentaire'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.innerHTML = headerText;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
  
    stageList.forEach(stage => {
        const row = document.createElement('tr');

        const cell1 = document.createElement('td');
        cell1.contentEditable = true;
        cell1.innerHTML = stage.age;
        cell1.addEventListener('click', () => cell1.focus());
        row.appendChild(cell1);

        const cell2 = document.createElement('td');
        cell2.contentEditable = true;
        cell2.innerHTML = stage.staName;
        cell2.addEventListener('click', () => cell2.focus());
        row.appendChild(cell2);

        const cell3 = document.createElement('td');
        cell3.contentEditable = true;
        cell3.innerHTML = stage.debut; 
        cell3.addEventListener('click', () => cell3.focus());
        row.appendChild(cell3);

        const cell4 = document.createElement('td');
        cell4.contentEditable = true;
        cell4.innerHTML = stage.fin;
        cell4.addEventListener('click', () => cell4.focus());
        row.appendChild(cell4);

        const cell5 = document.createElement('td');
        cell5.contentEditable = true;
        cell5.innerHTML = stage.salle1;
        cell5.addEventListener('click', () => cell5.focus());
        row.appendChild(cell5);

        const cell6 = document.createElement('td');
        cell6.contentEditable = true;
        cell6.innerHTML = stage.salle2;
        cell6.addEventListener('click', () => cell6.focus());
        row.appendChild(cell6);

        const cell7 = document.createElement('td');
        cell7.contentEditable = true;
        cell7.innerHTML = stage.prof1 ? stage.prof1.nom : '';
        cell7.addEventListener('click', () => cell7.focus());
        row.appendChild(cell7);

        const cell8 = document.createElement('td');
        cell8.contentEditable = true;
        cell8.innerHTML = stage.prof2 ? stage.prof2.nom : '';
        cell8.addEventListener('click', () => cell8.focus());
        row.appendChild(cell8);

        const cell9 = document.createElement('td');
        cell9.contentEditable = true;
        cell9.innerHTML = stage.commentaire;
        cell9.addEventListener('click', () => cell9.focus());
        row.appendChild(cell9);

        table.appendChild(row);
    });
  
    return table;
  }

async function saveDocAccueil(stageList, date1, date2) {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    const userDataPath = await ipcRenderer.invoke('get-user-path');
    const formattedDate1 = date1.toISOString().slice(0, 10);
    const formattedDate2 = date2.toISOString().slice(0, 10);
    const filePath = path.join(userDataPath, formattedDate1 + '-' + formattedDate2 + '-stageList.json');
    const dataJSON = JSON.stringify(stageList);
    await fs.writeFileSync(filePath, dataJSON);
}

async function checkStageListJson(date1, date2) {
  date1.setHours(0, 0, 0, 0);
  date2.setHours(0, 0, 0, 0);
  const userDataPath = await ipcRenderer.invoke('get-user-path');
  const formattedDate1 = date1.toISOString().slice(0, 10);
  const formattedDate2 = date2.toISOString().slice(0, 10);
  const filePath = path.join(userDataPath, formattedDate1 + '-' + formattedDate2 + '-stageList.json');
  if (fs.existsSync(filePath)) {
    const dataJSON = fs.readFileSync(filePath);
    const stageList = JSON.parse(dataJSON);
    return stageList;
  } else {
    return [];
  }
}
module.exports = {
    newStageList,
    generateEditableTable,
    saveDocAccueil,
    checkStageListJson
};