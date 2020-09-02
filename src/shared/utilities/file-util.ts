/**
 * @description a utility class for files
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class FileUtil
 */
export class FileUtil {

    /**
     * @description to download an xls with data and name
     * @author Pulkit Bansal
     * @date 2020-04-27
     * @static
     * @param {*} data
     * @param {string} name
     * @memberof FileUtil
     */
    static downloadXls(data: any, name: string): void {
        let blob;
        const anchor = document.createElement('a');
        blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        anchor.download = name + '.xlsx';
        const url = URL.createObjectURL(blob);
        anchor.href = url;
        anchor.click();
    }

}
