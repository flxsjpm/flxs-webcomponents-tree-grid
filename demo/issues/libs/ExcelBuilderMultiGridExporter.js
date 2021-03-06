/**
 * Flexicious
 * Copyright 2011, Flexicious LLC
 */
(function (window) {
    "use strict";
    var ExcelBuilderMultiGridExporter, uiUtil = flexiciousNmsp.UIUtils, flxConstants = flexiciousNmsp.Constants,
                                       excelUtil = ExcelBuilder.util, excelPos = ExcelBuilder.Positioning;
    /**
     * Exports the grid in CSV format
     * @constructor
     * @namespace
     * @extends Exporter
     */
    ExcelBuilderMultiGridExporter = function () {


        /**
         * object representing the columns
         */
        //this.columns = [];

        /**
         * object representing the data
         */
        this.data = [];

        this.multiGridData = [];

        this._isMultiTabbed = false;

        this.needSeparator = false;

        this.separatorCount = 2;

        this._exportFileName = "exported-grid";

        this._headerIndex = -1;

        this._footerIndex = -1;

        this._exportableColumns = [];

        this._customStyleFunction = null;

        this._drawings = null;

        this.defaultImages = [ 
            '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'
        ];

    };
    flexiciousNmsp.ExcelBuilderMultiGridExporter = ExcelBuilderMultiGridExporter; //add to name space
    ExcelBuilderMultiGridExporter.prototype.typeName = ExcelBuilderMultiGridExporter.typeName = 'ExcelBuilderMultiGridExporter';//for quick inspection


    /**
     * @private
     * @param grid
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.writeHeader = function (grid) {

        var colIndex = 0;
        var columns = {};

        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col)) {
                continue;
            }
            var val = this.getText(flexiciousNmsp.Exporter.getColumnHeader(col, colIndex));
            columns[col.dataField] = val;
            colIndex++;
        }

        if (colIndex > 0) {
            this._headerIndex = this.data.push(columns) - 1;
        }
        return "";
    };

    /**
     * Writes an individual record in csv format
     * @param grid
     * @param record
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.writeRecord = function (grid, record) {

        var colIndex = 0;
        var exporter = grid.excelOptions.exporter;

        var item = {};
        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!exporter.isIncludedInExport(col)) {
                continue;
            }
            var value = flexiciousNmsp.UIUtils.resolveExpression(record, col.dataField);
            value = value ? this.getText(value) : "";
            item[col.dataField] = (value ? isNaN(value) ? value : Number(value) : "");
        }
        this.data.push(item);
        return "";

    };

    ExcelBuilderMultiGridExporter.prototype.writeFooter = function (grid, dataProvider) {

        var colIndex = 0;
        var footerColumns = {};
        var exporter = grid.excelOptions.exporter;

        if (grid.excelOptions.includeFooters) {
            var i = 0;
            if (!exporter.reusePreviousLevelColumns) {
                while (i++ < exporter.getNestDepth()) {
                    footerColumns['ZeroPaddingCell'] = '';
                }
            }

            for (var i = 0; i < grid.getExportableColumns().length; i++) {
                var col = grid.getExportableColumns()[i];
                if (!exporter.isIncludedInExport(col))
                    continue;
                var spaces = exporter.getSpaces(col);
                var value = this.getText(col.calculateFooterValue(dataProvider));
                footerColumns[col.dataField] = (spaces ? spaces + value : (value ? isNaN(value) ? value : Number(value) : ""));
                colIndex++;
            }

            if (colIndex > 0) {
                this._footerIndex = this.data.push(footerColumns) - 1;
            }
        }

        return "";
    };

    /**
     *
     * @param gridProps each property should have {grid: <grid>, sheet: <sheet-name>} such structure
     * @param {Boolean} multiTab default set to false
     */
    ExcelBuilderMultiGridExporter.prototype.generate = function (gridProps, multiTab) {

        if (typeof multiTab === 'undefined') multiTab = false;

        this._isMultiTabbed = multiTab;

        var i;
        var ws;

        /* build workbook */
        var new_wb = ExcelBuilder.Builder.createWorkbook();
        this.stylesheet = new_wb.getStyleSheet();

        for (i = 0; i < gridProps.length; i++) {
            this.writeHeader(gridProps[i].grid);
            [].forEach.call(gridProps[i].grid.getDataProviderNoPaging(), function (data) {
                this.writeRecord(gridProps[i].grid, data);
            }, this);

            this.writeFooter(gridProps[i].grid, gridProps[i].grid.getDataProviderNoPaging());
            this.multiGridData.push(this.data.slice(0));
            this.data = [];

            if (multiTab) {
                ws = new_wb.createWorksheet({ name: this.getValidSheetName(gridProps[i]) });
                this.attachWorkSheet(new_wb, ws, [gridProps[i]]);
                
                this.multiGridData.pop();
            } else if ( i === gridProps.length - 1 ) {
                ws = new_wb.createWorksheet({ name: this.getValidSheetName(gridProps[i]) });
                this.attachWorkSheet(new_wb, ws, gridProps);
                this.multiGridData[i].map(function(data, index) {
                    this.mergeCells(ws, index, 2, index, 3);
                }.bind(this))

                this.mergeCells(ws, 4, 0, 4 + 5, 0);

                var offsetRows = this.separatorCount + this.multiGridData[0].length;

                this.mergeCells(ws, 4 + offsetRows, 0, 4 + 5 + offsetRows, 0);
            }
        }

        /* write file and trigger a download */
        ExcelBuilder.Builder.createFile(new_wb).then(function (data) {
            var fname = this._exportFileName + "." + this.getExtension();
            try {
                saveAs(this.b64toBlob(data, "application/octet-stream"), fname);
            } catch (e) { if (typeof console != 'undefined') console.log(e, wbout); }

            this.columns = [];
            this.data = [];
            
            if(window.hasOwnProperty('stylz')) {
                delete window.stylz;
            }

        }.bind(this));
    };

    /* ==================== Utils methods ====================== */

    ExcelBuilderMultiGridExporter.prototype.b64toBlob = function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    ExcelBuilderMultiGridExporter.prototype.pixelToExcelInches = function(pixels) {
      return ((pixels - 12) / 7.0  +  1);  
    };

    ExcelBuilderMultiGridExporter.prototype.getText = function (htmlText) {
        // parse html too and fetch textContent from that html
        var parser = new DOMParser();
        var doc = parser.parseFromString('<span>' + htmlText + '</span>', "text/xml");
        htmlText = doc.firstChild.outerText || doc.firstChild.textContent;
        return htmlText;
    };

    ExcelBuilderMultiGridExporter.prototype.setColumnsWidth = function (ws, gridProps) {
        var wscols = [];

        var cws = [];
        [].forEach.call(gridProps, function(gridProp) {
            this.filterExportableColumns(gridProp.grid);
            this._exportableColumns.map(function(col, index) {

                if( index < cws.length ) {
                    cws[index] = Math.max(cws[index], col.getWidth())
                } else {
                    cws.push(col.getWidth());
                }
                
            }.bind(this));
        }.bind(this));

        [].forEach.call(cws, function (w) {
            wscols.push({ width: this.pixelToExcelInches(w) });
        }.bind(this));
        
        ws.setColumns(wscols);
    };

    ExcelBuilderMultiGridExporter.prototype.mergeCells = function(ws, startRowIndex, startColIndex, endRowIndex, endColIndex) {
        var a1NotationFrom = excelUtil.positionToLetterRef(startColIndex + 1, startRowIndex + 1);
        var a1NotationTo   = excelUtil.positionToLetterRef(endColIndex + 1, endRowIndex + 1);
        ws.mergeCells(a1NotationFrom, a1NotationTo);
    };

    ExcelBuilderMultiGridExporter.prototype.setPageMargins = function(ws, top, right, bottom, left, header, footer) {
        ws.setPageMargin({ top: top || 0.7, bottom: bottom || 0.7, left: left || 0.7, right: right || 0.7, header: header || 0.3, footer: footer || 0.3 });
    };

    ExcelBuilderMultiGridExporter.prototype.getColumnLabels = function(grid, columns) {
        var colTexts = [];
        var headerData = columns;
        var dgCols = this._exportableColumns;
        [].forEach.call(dgCols, function(col) {
            colTexts.push(headerData[col.dataField]);
        });
        return colTexts;
    };

    ExcelBuilderMultiGridExporter.prototype.attachImages = function(wb, ws, r, c) {
        
        if( !this._drawings ) {
            this._drawings = new ExcelBuilder.Drawings();
            ws.addDrawings(this._drawings);
            wb.addDrawings(this._drawings);
        }
        
        var picRef = wb.addMedia('image', 'logo_' + r + '.png', this.defaultImages[r%2]);
        var picture = new ExcelBuilder.Drawing.Picture();
        picture.createAnchor('oneCellAnchor', {
            x: c,
            y: r,
            xOff: excelPos.pixelsToEMUs(24)/4, 
            yOff: excelPos.pixelsToEMUs(12)/4,
            width: excelPos.pixelsToEMUs(24),
            height: excelPos.pixelsToEMUs(12)
        });

        picture.setMedia(picRef);
        this._drawings.addDrawing(picture);
    };

    /**
     * 
     * @param {Function} fn 
     * @example 
     *  customStyle(cellData, dgCol, existingStyle) {
     *      return existingStyle;
     *  }
     */
    ExcelBuilderMultiGridExporter.prototype.setCustomStyleFunction = function(fn) {
        this._customStyleFunction = fn;
    };

    ExcelBuilderMultiGridExporter.prototype.attachWorkSheet = function (workbook, worksheet, gridProps) {
        workbook.addWorksheet(worksheet);

        var styledData = [];

        for(var i=0;i<gridProps.length;i++) {
            this.filterExportableColumns(gridProps[i].grid);

            var table = new ExcelBuilder.Table();
            worksheet.addTable(table);
            workbook.addTable(table);

            var data = this.multiGridData[i] || [];
            // table.styleInfo.themeStyle = style || '';
            if (data.length > 0 && this._headerIndex !== -1) {
                table.setReferenceRange([1, 1], [data[0].length, data.length]);
                table.setTableColumns(this.getColumnLabels(gridProps[i].grid, data[0]));
            }

            if( this.needSeparator ) {
                for(var k=0;k<this.separatorCount;k++) {
                    styledData = styledData.concat([{value: ''}]);
                }
            }
            
            styledData = styledData.concat(this.setStyles(data, gridProps[i].grid, this.defaultStyles()));

            if( !this._isMultiTabbed ) this.needSeparator = true;
        }


        worksheet.setData(styledData);
        this.setColumnsWidth(worksheet, gridProps);

        this.setPageMargins(worksheet);
        styledData.map(function(d, i) {
            if(d.value !== "") {
                return this.attachImages(workbook, worksheet, i, 5);
            } else {
                return d;
            }
        }.bind(this));
        
    };

    ExcelBuilderMultiGridExporter.prototype.setStyles = function(data, grid, style) {

        // borderTypes = [ 'top', 'topleft', 'left', 'bottomleft', 'bottom', 'bottomright', 'right', 'topright' ];

        var items = [];
        for(var r=0;r<data.length;r++) {
            var item = [];
            for(var m=0, c=0;m<this._exportableColumns.length;m++) {
                var dgCol = this._exportableColumns[m];

                if(!data[r].hasOwnProperty(dgCol.dataField)) {
                    continue;
                }

                var cell = {};
                cell['value'] = data[r][dgCol.dataField];
                cell['metadata'] = {};

                var type = this._headerIndex == r ? 'header' : this._footerIndex === r ? 'footer' : r % 2 === 0 ? 'dataCell0' : 'dataCell1';

                var edge = false;
                var firstRow = type === 'header' || r === 0, lastRow = type === 'footer' || r == data.length - 1, firstCol = c == 0, lastCol = c == Object.keys(data[r]).length - 1;
                var top = false, left = false, bottom = false, right = false;

                if( firstRow && !firstCol && !lastCol ) {
                    edge = true;
                    top = true;
                }
                if( firstRow && firstCol ) {
                    edge = true;
                    top = true;
                    left = true;
                }
                if( !firstRow && !lastRow && firstCol ) {
                    edge = true;
                    left = true;
                }
                if( lastRow && firstCol ) {
                    edge = true;
                    left = true;
                    bottom = true;
                }
                if( lastRow && !firstCol && !lastCol ) {
                    edge = true;
                    bottom = true;
                }
                if( lastRow && lastCol ) {
                    edge = true;
                    bottom = true;
                    right = true;
                }
                if( !firstRow && !lastRow && lastCol ) {
                    edge = true;
                    right = true;
                }
                if( firstRow && lastCol ) {
                    edge = true;
                    top = true;
                    right = true;
                }

                var _borderBoxStyle = {};

                if( edge ) {
                    _borderBoxStyle.top = top;
                    _borderBoxStyle.left = left;
                    _borderBoxStyle.bottom = bottom;
                    _borderBoxStyle.right = right;
                    _borderBoxStyle.style = 'thick';
                    _borderBoxStyle.color = 'FF00FF00';
                }

                if( this._customStyleFunction ) {
                    var typ = 'custom_' + type;
                    var cellData = this.deepClone(data[r]);
                    cellData['rowIndex'] = r;
                    cellData['cellType'] = type;
                    var s = this._customStyleFunction(cellData, dgCol, this.deepClone(style[type]));
                    if( s ) {
                        type = typ;
                        style[type] = s;
                    }
                }

                cell['metadata']['style'] = this.generateStyleId(type, style, _borderBoxStyle, [r, c]).id;
                
                item.push(cell);

                c++;
            }

            items.push(item);
        }
        
        return items;
    };

    ExcelBuilderMultiGridExporter.prototype.generateStyleId = function(type, style, box, c) {

        box = box || { top: false, left: false, right: false, bottom: false };

        var comboStyles = this.deepClone(style[type]);
        var defaultBorderStyle = { style: 'thin', color: 'FFCCCCCC' };

        var boxBorder = {};
        var defaultBoxBorder = {};

        var existingBorder = comboStyles.hasOwnProperty('border') ? this.deepClone(comboStyles.border) : {};
        comboStyles.border = {};
        
        [].forEach.call(Object.keys(box), function(prop) {
            if( box[prop] === true || box[prop] === false ) {
                defaultBoxBorder[prop] = this.deepClone(defaultBorderStyle);
            }
        }.bind(this));

        [].forEach.call(Object.keys(box), function(prop) {
            if( box[prop] === true ) {
                boxBorder[prop] = { style: box.style, color: box.color };
            }
        }.bind(this));

        this.copyProperties( boxBorder, comboStyles.border );
        this.copyProperties( existingBorder, comboStyles.border, true );
        this.copyProperties( defaultBoxBorder, comboStyles.border );

        window.stylz = window.stylz || [];
        window.stylz.push({ row: c[0], col: c[1], style: comboStyles});

        return this.stylesheet.createFormat(comboStyles);
    };

    ExcelBuilderMultiGridExporter.prototype.copyProperties = function (src, dest, override) {
        override = override || false;
        dest = dest || {};
        
		for (var key in src) {
			if (!dest.hasOwnProperty(key) || override) {
				dest[key] = src[key];
			}
		}
    };
    
    ExcelBuilderMultiGridExporter.prototype.deepClone = function(obj) {
        if( typeof obj === 'object' ) {
            return JSON.parse(JSON.stringify(obj));
        }
        return obj;
    };

    /* ========================== x ============================ */

    ExcelBuilderMultiGridExporter.prototype.defaultStyles = function() {
        return {
            header: {
                font: {
                    bold: true, underline: true, size: 18, fontName: 'Times New Roman'
                }, alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }, fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '88FF8800',
                    bgColor: '88002222'
                }, border: {
                    bottom: { style: 'thick', color: 'FF000000' }
                }
            }, footer: {
                font: {
                    bold: true, size: 18, fontName: 'Times New Roman'
                }, alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }, border: {
                    top: { style: 'thick', color: 'FF222222' }
                }
            }, dataCell0: {
                font: {
                    size: 14.5, fontName: 'Times New Roman'
                }, alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }, border: {

                }
            }, dataCell1: {
                font: {
                    size: 14.5, fontName: 'Times New Roman'
                }, alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }, fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: 'FFFFEF00',
                    bgColor: 'FF000000'
                }, border: {
                    
                }
            }, errorCell: {
                font: {
                    size: 14.5, fontName: 'Times New Roman', color: 'FFFFFFFF'
                }, alignment: {
                    horizontal: 'center',
                    vertical: 'center'
                }, fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: 'FF880000',
                    fgColor: 'FF880000'
                }, border: {
                    
                }
            }
        };
    };

    ExcelBuilderMultiGridExporter.prototype.filterExportableColumns = function(grid) {
        this._exportableColumns = [];
        for (var i = 0; i < grid.getExportableColumns().length; i++) {
            var col = grid.getExportableColumns()[i];
            if (!grid.excelOptions.exporter.isIncludedInExport(col)) {
                continue;
            }
            this._exportableColumns.push(col);
        }
    }

    /**
     * set name of the download file.
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.setFileName = function (filename) {
        this._exportFileName = filename;
    };

    /**
     * Extension of the download file.
     * @return
     *
     */
    ExcelBuilderMultiGridExporter.prototype.getExtension = function () {
        return "xlsx";
    };

    ExcelBuilderMultiGridExporter.prototype.getValidSheetName = function (gridProps) {
        return gridProps.hasOwnProperty('sheet') && gridProps.sheet ? gridProps.sheet : undefined;
    };

}(window));
