import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { BaseService } from '../services/base.service';
import { Iresponse } from '../models/iresponse';
import { Inotify } from './models/iproduct';
// import { ClientSideRowModelSteps } from 'ag-grid-community';
// import { RangeSelection } from 'ag-grid-community';
// import { ActionCellRenderer } from './actionCell.component';

  
function actionCellRenderer(params:any) {
    let eGui = document.createElement("div");

    let editingCells = params.api.getEditingCells();
    // checks if the rowIndex matches in at least one of the editing cells
    let isCurrentRowEditing = editingCells.some((cell:any) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    if (isCurrentRowEditing) {
      eGui.innerHTML = `
        <button  class="btn btn-outline-info"  data-action="update"> Update  </button>
        <button  class="btn btn-outline-secondary"  data-action="cancel" > Cancel </button>
        `;
    } else {
      eGui.innerHTML = `
        <button class="btn btn-outline-success"  data-action="edit" > Edit  </button>
        <button class="btn btn-outline-danger" data-action="delete" > Delete </button>
        `;
    }

    return eGui;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent {
  public gridApi:any;
  public gridColumnApi:any;
  public newButton:string = "Add Product"
  public notifyPop: boolean = false;
  public notifyMsg: Inotify = {success:false,msg:""};
  rowData: any = [
  ];

  columnDefs: ColDef[] = [
    {field:'id', width: 50},
    {field:'name'},
    {field:'state', width: 100},
    {field:'zip', width:100},
    {editable: true, field:'amount', width:100},
    {editable: true, field:'qty', width:70},
    {field:'item', width:150},
    {
      headerName: "action",
      minWidth: 150,
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: "action"
    }
  ];
  defaultColDef = {
    editable: true
  };

  constructor(
    private baseService: BaseService) {
  }
  
  createProduct($event:any){
    this.baseService.addProducts($event).subscribe((resp : Iresponse) => {
      this.rowData = resp.data;
    });
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.baseService.getProducts().subscribe((resp) => {
      this.rowData = resp.data;
    });
  }

  onCellClicked(params:any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.baseService.deleteProducts(params.node.data).subscribe((resp) => {
           resp.status == "success" ? this.showNotifyPop({success:true,msg:resp.message}) : this.showNotifyPop({success:false,msg:resp.message}) 
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
        this.baseService.updateProducts(params.node.data).subscribe((resp) => {
          resp.status == "success" ? this.showNotifyPop({success:true,msg:resp.message}) : this.showNotifyPop({success:false,msg:resp.message}) 
        });

      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }

  onRowEditingStarted(params:any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  onRowEditingStopped(params:any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }

  showNotifyPop(msg:Inotify) : void {
    this.notifyMsg = msg;
    if (this.notifyPop) { 
      return;
    } 
    this.notifyPop = true;
    setTimeout(()=> this.notifyPop = false,2500)
  }
}
