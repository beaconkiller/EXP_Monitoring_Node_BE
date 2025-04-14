const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
const handlebars = require("handlebars");
const { chromium } = require("playwright");

// const sendMail = require('../controllers/f_mailer')
const sendMail = require('./f_mailer')


// =======================================================================
// ============================= GETTING DATA ===============================
// =======================================================================

handlebars.registerHelper("eq", function (a, b) {
    return a == b;
});


handlebars.registerHelper("isLastThree", function (index, total) {
    return index >= total - 3;
});



exports.get_detail_pengajuan_item = async (req, res) => {
    console.log('\n ============== get_detail_pengajuan_item ================ \n')

    console.log(req.query);
    req_id = req.query.req_id;

    try {
        let q = `
            select ttfd.* from tf_eappr.tf_trn_fppu_dtls ttfd
            where
                REQUEST_ID = '${req_id}'
            order by 
                ttfd.CREATED_DATE DESC, 
                ttfd.REQUEST_ID DESC
        `

        let xRes = await simpleExecute(q);

        // console.log(xRes)

        return res.status(200).json({
            isSuccess: true,
            data: xRes
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}


exports.get_approval_data = async (req, res) => {
    console.log("get_approval_data")
    console.log(req.query);
    req_id = req.query.req_id;

    try {
        let q = `
            select ttaf.*, tluav.empl_name, tluav.job_name, tluav.cabang  from tf_eappr.tf_trn_approve_fppu ttaf 
            left join 
                tf_eappr.tf_list_user_approve_v tluav on tluav.empl_code = ttaf.EMPL_CODE 
            where REQUEST_ID = '${req_id}'
            order by LVL asc
        `

        let xRes = await simpleExecute(q);

        xRes.forEach(el => {
            if (el['FILE_NAME'] != null) {
                el['sig_base64'] = give_base64_sig(el['FILE_NAME'])
            } else {
                el['sig_base64'] = null
            }
        });



        return res.status(200).json({
            isSuccess: true,
            data: xRes
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}


exports.get_file_data = async (req, res) => {
    console.log('get_file_data');
    console.log(req.query);
    req_id = req.query.req_id;


    // test = {
    //     test : 'null',
    //     test2 : null
    // }


    // console.log(JSON.stringify(test))

    try {

        // ===============================================================
        // ===================== GETTING THE FILE NAME ====================
        // ===============================================================


        file_data = {
            file_name: '',
            file_data: ''
        }

        let q = `
            select ttfd.* from tf_eappr.tf_trn_fppu_dtls ttfd
            where
                REQUEST_ID = '${req_id}'
            order by 
                ttfd.CREATED_DATE DESC, 
                ttfd.REQUEST_ID DESC
        `

        let xRes = await simpleExecute(q);


        // ================================================================
        // ============ IF FILE NAME IS NULL, OR NOT EXIST ================
        // ================================================================

        let file_name = xRes[0]['FILE_NAME'];

        console.log("xRes");
        console.log(xRes[0]);
        console.log(xRes[0]['FILE_NAME']);



        if (xRes[0]['FILE_NAME'].length == 0) {
            return res.status(200).json({
                isSuccess: true,
                data: {
                    file_name: '',
                    file_data: ''
                }
            })
        }

        file_data.file_name = xRes[0]['FILE_NAME'];
        file_path = path.join(__dirname, '..', 'file_storage', 'file_pengajuan', file_name)



        // ==============================================================
        // ===================== READING THE FILE =========================
        // ==============================================================

        const data_base64 = () => {
            try {
                return fs.readFileSync(file_path, 'base64');
                // console.log(data);
            } catch (err) {
                console.error(err);
            }
        }



        return res.status(200).json({
            isSuccess: true,
            data: {
                file_name: file_name,
                data: data_base64()
            }
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}


exports.get_sig_img_data = async (req, res) => {
    console.log('get_sig_img_data')
    console.log(req.query);
    req_id = req.query.req_id;

    try {

        // ===============================================================
        // ===================== GETTING THE FILE NAME ====================
        // ===============================================================


        let q = `
            select * from tf_eappr.tf_trn_approve_fppu ttaf 
            where
                REQUEST_ID = '${req_id}'
            order by LVL
        `

        let xRes = await simpleExecute(q);

        console.log(xRes)

        file_name = xRes[0]['FILE_NAME'];
        file_path = path.join(__dirname, '..', 'file_storage', 'file_pengajuan', file_name)




        // ==============================================================
        // ===================== READING THE FILE =========================
        // ==============================================================

        const data_base64 = () => {
            try {
                return fs.readFileSync(file_path, 'base64');
                // console.log(data);
            } catch (err) {
                console.error(err);
            }
        }


        return res.status(200).json({
            isSuccess: true,
            data: {
                file_name: file_name,
                data: data_base64()
            }
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}

// Load template HTML dari file
const templatePath = path.join(__dirname, "..", "web", "template", "invoice.html");
const templateHtml = fs.readFileSync(templatePath, "utf8");
const template = handlebars.compile(templateHtml);

// Format ke Rupiah
const formatRupiah = (number) =>
    number.toLocaleString("id-ID", {
        // style: "currency", currency: "IDR", 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });


exports.get_pdf_export = async (req, res) => {
    console.log('get_pdf_export')
    req_id = req.query.req_id;

    console.log(req_id);

    // ====================== BANG BIL DISINI BANGBIL ======================
    // ====================== BANG BIL DISINI BANGBIL ======================
    // ====================== BANG BIL DISINI BANGBIL ======================
    // const invoiceId = req.query.id;

    console.log(req_id);

    // const invoiceId = req.params.id;
    const invoiceData = await getInvoiceData(req_id);

    if (!invoiceData) {
        return res.status(404).json({ message: "Invoice tidak ditemukan" });
    }

    // Tambahkan logo ke dalam data
    const logoPath = path.join(__dirname, "..", "web", "assets", "logo_tf_horizontal.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    invoiceData.logoBase64 = `data:image/png;base64,${logoBase64}`;

    const logoBgPath = path.join(__dirname, "..", "web", "assets", "logo_bg.jpg");
    const logoBgBase64 = fs.readFileSync(logoBgPath).toString("base64");
    invoiceData.logoBgBase64 = `data:image/png;base64,${logoBgBase64}`;

    invoiceData.totalApprovals = invoiceData.approvals ? invoiceData.approvals.length : 0;

    // Render HTML dengan data
    const htmlContent = template(invoiceData);

    // Gunakan Playwright untuk generate PDF
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Buat file PDF
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    // Kirim PDF sebagai response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.send(pdfBuffer);

}

async function getInvoiceData(invoiceId) {
    try {
        // Ambil data invoice utama
        // const [invoice] = await db.query(`select * from tf_trn_fppu_hdrs a
        //     join tf_absensi.hr_mst_offices b
        //     on a.branch_code = b.office_code
        //     where a.request_id = ?`, [invoiceId]);
        // if (invoice.length === 0) return null;

        console.log('1');
        const bind = {
            invoiceId: invoiceId
        }

        const invoice = await simpleExecute(`
            select * from tf_trn_fppu_hdrs a
            join tf_absensi.hr_mst_offices b
            on a.branch_code = b.office_code
            where a.request_id = :invoiceId`, bind)
        if (invoice.length === 0) return null;
        console.log('2');

        console.log(invoice);

        const formatedInvoice = invoice.map((item, index) => {
            const requestId = item.REQUEST_ID;
            const createdDate = item.CREATED_DATE;
            const officeCode = item.OFFICE_CODE;
            const officeName = item.NAME_FULL;
            console.log('3');

            return {
                REQUEST_ID: requestId,
                CREATED_DATE: createdDate,
                officeCode: officeCode,
                officeName: officeName
            };
        });

        // Ambil data produk terkait invoice
        // const [products] = await db.query(
        //     `SELECT * FROM tf_trn_fppu_dtls WHERE request_id = ?`,
        //     [invoiceId]
        // );
        console.log('4');

        const products = await simpleExecute(
            `SELECT * FROM tf_trn_fppu_dtls WHERE request_id = :invoiceId`, bind
        );
        console.log('5');


        // Hitung subtotal
        let totalItem = 0;
        let subtotal = 0;
        let totalPPN = 0;
        let totalPPH = 0;
        console.log('6');

        // Format data produk agar sesuai dengan template HTML
        const formattedProducts = products.map((item, index) => {
            console.log('7');

            const hargaSatuan = Number(item.HARGA_SATUAN);
            const qty = Number(item.QTY);
            const ppnPersen = Number(item.PPN);
            const pphPersen = Number(item.PPH);
            const totalItem = hargaSatuan * qty;

            // Tambahkan ke subtotal
            subtotal += totalItem;

            // Hitung PPN dan PPH berdasarkan persen
            const ppn = (totalItem * ppnPersen) / 100;
            const pph = (totalItem * pphPersen) / 100;

            // Tambahkan ke total PPN dan PPH keseluruhan
            totalPPN += ppn;
            totalPPH += pph;

            return {
                index: index + 1,
                KETERANGAN: item.KETERANGAN,
                JENIS_PEMBIAYAAN: item.JENIS_PEMBIAYAAN,
                BANK_NAME: item.BANK_NAME,
                HARGA_SATUAN: formatRupiah(hargaSatuan),
                QTY: qty,
                PPN: ppnPersen,
                PPH: pphPersen,
                TOTAL_ITEM: formatRupiah(totalItem),
            };
        });
        console.log('8');

        // Hitung Grand Total
        const grandTotal = subtotal + totalPPN - totalPPH;


        // const [approvals] = await db.query(
        //     `SELECT
        //         A.EMPL_CODE as empl_code,
        //         A.LVL as lvl, 
        //         A.STATUS as status, 
        //         A.REASON as reason, 
        //         A.STAT_DATE as stat_date,
        //         B.NAME AS name, 
        //         B.DIVISI as divisi
        //      FROM tf_trn_approve_fppu A
        //      JOIN TF_MST_DIVISION B ON A.EMPL_CODE = B.PERSONAL_NUMBER
        //      WHERE A.REQUEST_ID = ?`,
        //     [invoiceId]
        // );
        console.log('9');

        const approvals = await simpleExecute(
            `SELECT
            A.EMPL_CODE as empl_code,
            A.LVL as lvl, 
            A.STATUS as status, 
            A.REASON as reason, 
            A.STAT_DATE as stat_date,
            A.FILE_NAME as file_name,
            B.NAME AS name, 
            B.DIVISI as divisi
         FROM tf_trn_approve_fppu A
         JOIN TF_MST_DIVISION B ON A.EMPL_CODE = B.PERSONAL_NUMBER
         WHERE A.REQUEST_ID = :invoiceId`,
            bind
        );
        console.log('10');


        img_base64 = (imgPath) => {
            try {
                const logoBgBase64 = fs.readFileSync(imgPath).toString("base64");
                return `data:image/png;base64,${logoBgBase64}`;        
            } catch (error) {
                return ' - '
            }
        }
        
        const formattedApproval = approvals.map((item, index) => ({
            index: index + 1, // Nomor urut dalam tabel
            empl_code: item.empl_code,
            lvl: item.lvl,
            status: item.status,
            reason: item.reason,
            stat_date: item.stat_date ?? ' - ',
            name: item.name,
            divisi: item.divisi,
            signature: item.file_name ? img_base64(path.join(__dirname, "..", "file_storage", "ttd_approval", item.file_name)) : null  
        }))
            .sort((a, b) => a.lvl - b.lvl); // Urutkan dari level terendah ke tertinggi

        console.log(formattedApproval);

        return {
            invoice: formatedInvoice,
            products: formattedProducts,
            approvals: formattedApproval,
            subtotal: formatRupiah(subtotal),
            totalPPN: formatRupiah(totalPPN),
            totalPPH: formatRupiah(totalPPH),
            grandTotal: formatRupiah(grandTotal),
        };
    } catch (error) {
        console.error("Database error:", error);
        return null;
    }
}



function give_base64_sig(file_name) {
    try {
        const file_path = path.join(__dirname, '..', 'file_storage', 'ttd_approval', file_name)
        const file_ext = file_name.split('.')[0]
        const data_base64 = fs.readFileSync(file_path, 'base64')

        return `data:image/png;base64,${data_base64}`;
    } catch (err) {
        console.error(err);
    }
}