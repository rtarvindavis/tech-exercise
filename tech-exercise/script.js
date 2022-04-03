const app = new Vue({
  el: "#app",
  data: {
    buttonLoading: false,
    currentSort: 'name',
    currentSortDir: 'asc',
    errorVisible: false,
    numCheckboxesChecked: 0,
    selectedFiles: {},
    successVisible: false,
    tableData: [],
    warningVisible: false
  },
  mounted() {
    this.getData();
  },
  computed: {
    downloadIconText() {
      return '\xa0\xa0 Download Selected';
    },
    selectedText() {
      return '\xa0\xa0 Selected ' + this.numCheckboxesChecked;
    },
    sortedTableData() {
      return this.tableData.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === 'desc') modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    }
  },
  watch: {
    numCheckboxesChecked(newValue) {
      let checkboxes = document.getElementsByName("file");
      if (newValue === 0) {
        document.getElementById("selectAllCheckbox").indeterminate = false;
        document.getElementById("selectAllCheckbox").checked = false;
      } else if (newValue < checkboxes.length) {
        document.getElementById("selectAllCheckbox").indeterminate = true;
        document.getElementById("selectAllCheckbox").checked = false;
      } else {
        document.getElementById("selectAllCheckbox").indeterminate = false;
        document.getElementById("selectAllCheckbox").checked = true;
      }
    }
  },
  methods: {
    closeNotification() {
      this.errorVisible = false;
      this.successVisible = false;
      this.warningVisible = false;
    },
    formatStatus(statusStr) {
      return '\xa0\xa0' + statusStr[0].toUpperCase() + statusStr.substring(1);
    },
    getData() {
      this.tableData = [
        { name: 'smss.exe', device: 'Stark', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'scheduled' },
        { name: 'netsh.exe', device: 'Targaryen', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' },
        { name: 'uxtheme.dll', device: 'Lannister', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll', status: 'available' },
        { name: 'cryptbase.dll', device: 'Martell', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll', status: 'scheduled' },
        { name: '7za.exe', device: 'Baratheon', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'scheduled' }
      ];
    },
    getNumChecked() {
      let checkboxes = document.getElementsByName('file');
      let checked = 0;
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          checked++;
        }
      }
      
      this.numCheckboxesChecked = checked;
    },
    handleClick(event) {
      if (event.target.checked) {
        event.path[2].classList.add('active-row');
      } else {
        event.path[2].classList.remove('active-row');
      }
      
      this.getNumChecked();
    },
    sort(s) {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    },
    toggleAllCheckboxes(event) {
      let isChecked = event.target.checked;
      let checkboxes = document.getElementsByName('file');
      for (let checkbox in checkboxes) {
        checkboxes[checkbox].checked = isChecked;
      }
      
      this.getNumChecked();

      let table = document.getElementById("fileTable");
      let tableRows = table.getElementsByTagName('tbody')[0].children;
      for (let row of tableRows) {
        if (isChecked) {
          row.classList.add('active-row');
        } else {
          row.classList.remove('active-row');
        }
      }
    },
    validateDownloadSelections() {
      this.buttonLoading = true;
      this.errorVisible = false;
      this.successVisible = false;
      this.warningVisible = false;
      let availCheckboxesSelected = [];

      let checkboxes = document.getElementsByName("file");
      for (let checkbox in checkboxes) {
        if (checkboxes[checkbox].checked) {
          if (this.tableData[checkbox] && this.tableData[checkbox].status != 'available') {
            this.errorVisible = true;
          } else if (this.tableData[checkbox]) {
            availCheckboxesSelected.push(this.tableData[checkbox]);
          }
        }
      }
      
      if (availCheckboxesSelected.length === 0 && !this.errorVisible) {
        this.warningVisible = true;
      }
      
      this.selectedFiles = availCheckboxesSelected;
      if (!this.errorVisible && !this.warningVisible) {
        this.successVisible = true;
      }
      
      setTimeout(() => {
        this.buttonLoading = false;
      }, 100);
    }
  }
});