<div class="row">
    <div class="col-12">
        <div class="page-title-box">
            <h2 class="page-title"><b>Tambah CSR</b></h2>
        </div>
    </div>
</div>
<!-- TAMBAH CSR -->
<div class="row">
    <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/simpan'), 'update' => '#pesan', 'type' => 'post', 'processData' => 'false', 'contentType' => 'false', 'upload' => 'true')); ?>
    <div class="col-12">
        <div class="card-box">
            <div class="row">
                <div class="col-xl-12">
                    <a style="width: 100px" href="#" onclick='show("<?= $folder; ?>/cform/","#main"); return false;'
                        class="fa fa-undo btn btn-primary btn-sm waves-effect waves-ligh"> Cancel</a>
                    <button style="width: 100px" type="button" onclick="return cek_val()" id="simpan"
                        class="fa fa-save btn btn-success btn-sm"> Save</button>
                </div>
                <div class="col-xl-12">
                    <div id="pesan">

                    </div>
                </div>

                <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">
                    <h3><b> CSR-EMM/----/--/-----</b></h3>
                    <h5><b>Product To Service</b></h5>
                    <table class="table table-sm table-striped">
                        <thead>
                            <tr>
                                <th width="27%">Serial Number <span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th>
                                    <input required onkeyup="isi_otomatis()" id="barcode" name="sn_number"
                                        data-mask="99.999.99999.99.99999" class="form-control form-control-sm"
                                        placeholder="Enter Serial Number">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Product Name<span class="text-danger"> </span></th>
                                <th>:</th>
                                <th>
                                    <select class="form-control form-control-sm" id="id_product" name="id_product"
                                        required>
                                        <option></option>
                                        <?php if ($data_barang) {
                                            foreach ($data_barang->result() as $row) {
                                                $sb_code = $row->id_product;
                                                $sb_name = $row->code_product;
                                                // Anda dapat menggunakan substr pada $sb_name jika diperlukan
                                                // $sb_name2 = substr($sb_name, 0, 100);
                                                ?>
                                                <option value="<?= $sb_code ?>">
                                                    <?= $sb_name ?>
                                                </option>
                                            <?php }
                                        } ?>
                                    </select>

                                    <!-- <small><a href="#myModal1" data-animation="flip" data-plugin="myModal1" data-overlaySpeed="100" data-overlayColor="#36404a">Add Product</a>
                                            </small> -->
                                </th>
                            </tr>
                            <tr>
                                <td scope="row">Status Pemasangan<span class="text-danger"> *</span></td>
                                <th>:</th>
                                <td>
                                    <input required type="radio" name="sts_pasang" value="1" /><b> Pasang Baru</b><br>
                                    <input required type="radio" name="sts_pasang" value="0" /><b> Service</b>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div><!-- end col -->

                <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                    <table class="table table-sm table-striped">
                        <thead>
                            <tr>
                                <th scope="row">Delivery Order<span class="text-danger"> </span></th>
                                <th>:</th>
                                <th><input id="do_code" name="do_code" class="form-control form-control-sm"
                                        placeholder="Enter DO Nomor"></th>
                            </tr>

                        </thead>
                        <tbody>
                            <tr>
                                <th width="27%">Warranty Start <span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th><input id="tgl_delivered" value="<?php echo date('Y-m-d') ?>" style="width: 150px"
                                        type="date" name="tgl_delivered" class="form-control form-control-sm"
                                        placeholder="Enter employee name">
                                    <input hidden id="mesin_lama" name="mesin_lama"
                                        class="form-control form-control-sm">
                                </th>
                            </tr>
                            <tr>
                                <th scope="row">Warranty Time<span class="text-danger"> </span></th>
                                <th>:</th>
                                <th>12<input hidden id="warranty" style="width: 50px" name="warranty" value="12"
                                        class="form-control form-control-sm" placeholder="Enter Warranty Start"> Month 
                                    <span id="display_warranty_end"></span>
                                    <input hidden id="tgl_expired" name="waranty_end">
                                </th>
                            </tr>
                            <tr>
                                <th scope="row">Warranty Status<span class="text-danger"> </span></th>
                                <th>:</th>
                                <th id="warranty_status">
                                </th>
                            </tr>
                            <tr>
                                <th scope="row">Status SO<span class="text-danger"> </span></th>
                                <th>:</th>
                                <th><input readonly required style="width: 50%" id="status" name="so_oke"
                                        class="form-control form-control-sm"></th>
                            </tr>
                        </tbody>
                    </table>

                </div> <!-- end col -->



                <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">
                    <h5><b>Customer</b></h5>
                    <table class="table table-sm table-striped">
                        <tbody>
                            <tr>
                                <th width="27%">Customers Name <span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th>
                                    <select id="customers" name="customers" class="form-control form-control-sm">
                                        <option></option>
                                        <?php if ($data_customers) {
                                            foreach ($data_customers->result() as $row) { ?>
                                                <?php
                                                $no = 1;
                                                $sb_code = $row->id_customers;
                                                $sb_name = $row->nm_customers;
                                                $sb_name2 = substr($row->customers_address, 0, 100);
                                                if ($sb_code == '#cm_code') {
                                                    echo "<option value='" . $sb_code . "' data-provinsi='" . $row->provinsi . "' selected >" . $sb_name, ' --> ', $sb_name2 . " </option>";
                                                } else {
                                                    echo "<option value='" . $sb_code . "' data-provinsi='" . $row->provinsi . "' >" . $sb_name, ' --> ', $sb_name2 . " </option>";
                                                }
                                            }
                                        } ?>
                                    </select>
                                    <!-- <small><a href="#custom-modal-2" data-animation="flip" data-plugin="custommodal" data-overlaySpeed="100" data-overlayColor="#36404a">Add Customers</a>
                                            </small> -->
                                </th>
                            </tr>

                            <tr>
                                <th width="27%">Date Request <span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th><input style="width: 150px" value="<?php echo date('Y-m-d') ?>" type="date" required
                                        name="date_request" id="date_request" class="form-control form-control-sm"
                                        placeholder="DD/MM/YYYY" type="text" />
                                </th>
                            </tr>

                            <tr>
                                <th width="27%">Created Date<span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th>
                                    <?php echo date('d-M-Y') ?><input hidden style="width: 150px"
                                        value="<?php echo date('Y-m-d') ?>" type="date" required name="created_date"
                                        id="created_date" class="form-control form-control-sm" placeholder="DD/MM/YYYY"
                                        type="text" />
                                </th>
                            </tr>

                        </tbody>
                    </table>
                </div><!-- end col -->

                <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                    <table class="table table-sm table-striped">
                        <tbody>
                            <tr>
                                <th scope="row">Requestor<span class="text-danger"> *</span></th>
                                <th>:</th>
                                <th>
                                    <select required class="form-control form-control-sm" id="id_karyawan"
                                        name="id_karyawan">
                                        <option></option>
                                        <?php if ($data_karyawan) {
                                            foreach ($data_karyawan->result() as $row) { ?>
                                                <option value="<?= $row->id_karyawan; ?>">
                                                    <?= $row->nm_karyawan; ?>
                                                </option>
                                            <?php }
                                        } ?>
                                    </select>
                                    <br>
                                    <!-- <small><a href="#custom-modal-3" data-animation="flip" data-plugin="custommodal" data-overlaySpeed="100" data-overlayColor="#36404a">Add Employee</a>
                                            </small> -->
                                </th>
                            </tr>
                            <tr>
                                <th width="27%" scope="row">Lokasi<span class="text-danger"> *</span></th>
                                <th>:</th>
                                <th><label class="radio-inline">
                                        <input required type="radio" id="lokasi_dalam" name="lokasi" value="Dalam Kota" /> Dalam Kota
                                    </label>
                                    <label style="margin-left: 2%" class="radio-inline">
                                        <input required type="radio" id="lokasi_luar" name="lokasi" value="Luar Kota" /> Luar Kota
                                    </label>
                                </th>
                            </tr>
                        </tbody>
                    </table>

                </div> <!-- end col -->



                <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">
                    <h5><b>Laporan Kerusakan</b></h5>
                    <table class="table table-sm table-striped">
                        <tbody>
                            <tr>
                                <th width="27%" scope="row">Catatan Kerusakan<span class="text-danger"> *</span></th>
                                <th width="5%">:</th>
                                <th>
                                    <textarea required name="lap_kerusakan" class="form-control form-control-sm"
                                        id="exampleTextarea" rows="3"></textarea>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div><!-- end col -->

                <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                    <table class="table table-sm table-striped">
                        <tbody>
                            <tr>
                                <th width="27%" scope="row">Images<span class="text-danger"> </span></th>
                                <th width="5%">:</th>
                                <th>
                                    <label>Upload Image</label>
                                    <input type="file" name="link_foto" id="link_foto"
                                        accept=".png, .jpg, .jpeg, .bmp" />
                                    <i style="float: left; font-size: 9px; color: red">Ukuran gambar maksimal 500 KB</i>
                                    <!-- <progress id="progressBar" value="0" max="100" style="width:300px;"></progress>
                                      <h3 id="status"></h3>
                                      <p id="total"></p> -->
                                </th>

                            </tr>
                        </tbody>
                    </table>
                </div> <!-- end col -->

            </div>
            </form>
            <!-- Modal content 1-->
            <div class="modal fade" id="myModal1" role="dialog">
                <div class="modal-dialog modal-lg">

                    <div class="modal-content">
                        <div class="modal-body" id="isi_modal">
                            <?php // require 'vformadd_product.php'; 
                            ?>
                        </div>
                    </div>

                    <!-- Modal content 2-->
                    <div class="modal fade" id="custom-modal-2" role="dialog">
                        <div class="modal-dialog modal-lg">

                            <div class="modal-content">
                                <div class="modal-body" id="isi_modal">
                                    <?php // require 'vformadd_customers.php'; 
                                    ?>
                                </div>
                            </div>

                            <!-- Modal content 3-->
                            <div class="modal fade" id="custom-modal-3" role="dialog">
                                <div class="modal-dialog modal-lg">

                                    <div class="modal-content">
                                        <div class="modal-body" id="isi_modal">
                                            <?php // require 'vformadd_employee.php'; 
                                            ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </form>
</div>
<!-- End Row -->
<script>
    function updateWarranty() {
        var start = $('#tgl_delivered').val();
        var reqDate = $('#date_request').val();
        if (start && reqDate) {
            var d = new Date(start);
            d.setFullYear(d.getFullYear() + 1); // +12 months (atau +1 tahun)
            var end = d.toISOString().split('T')[0];
            $('#tgl_expired').val(end);

            // Format date for display: DD/MM/YY
            var dd = String(d.getDate()).padStart(2, '0');
            var mm = String(d.getMonth() + 1).padStart(2, '0');
            var yy = String(d.getFullYear()).slice(-2);
            $('#display_warranty_end').text(' ( ' + dd + '/' + mm + '/' + yy + ' )');

            var today = new Date().toISOString().split('T')[0];
            if (today >= start && today <= end) {
                $('#warranty_status').html('<b style="color: green;">GARANSI</b>');
            } else {
                $('#warranty_status').html('<b style="color: red;">TIDAK GARANSI</b>');
            }
        } else {
            $('#tgl_expired').val('');
            $('#display_warranty_end').text('');
            $('#warranty_status').html('');
        }
    }

    $(document).ready(function () {
        updateWarranty();
        $('#tgl_delivered, #date_request').on('change', function() {
            updateWarranty();
        });

        $('#customers').on('change', function() {
            var prov = $(this).find(':selected').data('provinsi');
            if (prov == '31') {
                $('#lokasi_dalam').prop('checked', true);
                $('#lokasi_luar').prop('checked', false);
            } else {
                if (prov != "" && prov != null) {
                    $('#lokasi_dalam').prop('checked', false);
                    $('#lokasi_luar').prop('checked', true);
                } else {
                    $('#lokasi_dalam').prop('checked', false);
                    $('#lokasi_luar').prop('checked', false);
                }
            }
        });

        $("#id_karyawan").select2({
            placeholder: "Select Karyawan",
            allowClear: true
        });

        // Pencarian
        $("#id_product").select2({ placeholder: "----- Select Product -----", allowClear: true });
        $("#customers").select2({ placeholder: "----- Select Customers -----", allowClear: true });
        $("#id_karyawan").select2({ placeholder: "----- Select Requestor -----", allowClear: true });
        // $("#id_product").select2({
        //     placeholder: "Select Produk",
        //     allowClear: true
        // });

        // $("#id_customers").select2({
        //     placeholder: "Select Customers",
        //     allowClear: true
        // });

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    $("#simpan").attr("disabled", false);
                    $("#simpan").html(" Save");
                }
            });
        });

        const target = document.getElementById('pesan');
        if (target) {
            observer.observe(target, { childList: true });
        }

    });

    function cek_val() {

        swal.fire({
            title: 'Konfirmasi',
            text: "Apakah anda yakin ingin menyimpan data ini ?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4fa7f3',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal',
        }).then(function (isConfirm) {
            if (isConfirm.value === true) {
                let form_tmp;
                $("form").each(function () {
                    let action = $(this).attr("action");
                    if (action && action.includes("/cform/simpan")) {
                        form_tmp = $(this);
                    }
                });

                if (form_tmp && form_tmp.length > 0) {
                    if (form_tmp[0].checkValidity()) {
                        $("#simpan").attr("disabled", true);
                        $("#simpan").html("<i class='fa fa-spinner fa-spin '></i> Simpan");
                        form_tmp.submit();
                    } else {
                        swal.fire("Gagal !", "Harap lengkapi seluruh data wajib mengisi.", "warning").then(() => {
                            setTimeout(() => {
                                form_tmp[0].reportValidity();
                            }, 300);
                        });
                    }
                }
            }
        })

    }

    function isi_otomatis() {
        var barcode = $("#barcode").val();
        $.ajax({
            type: "POST",
            url: base_url + '<?= $folder; ?>/cform/isi_otomatis',
            data: {
                barcode: barcode
            },
            dataType: "json",
            success: function (data) {
                if (data) {
                    // Mengisi data pada form jika data ditemukan
                    $('#sb_code').val(data.sb_code);
                    $('#tgl_delivered').val(data.tgl_delivered);
                    $('#do_code').val(data.do_code);
                    $('#id_product').val(data.id_product).trigger('change');
                    $('#status').val(data.status);
                    $('#sts_pasang').val(data.sts_pasang);
                    $('#customers').val(data.customers).trigger('change');
                    $('#mesin_lama').val(data.mesin_lama);
                    $('#so_oke').val(data.so_oke);
                    updateWarranty();
                } else {
                    // Membersihkan form jika data tidak ditemukan
                    $('#sb_code').val('');
                    $('#tgl_delivered').val('');
                    $('#do_code').val('');
                    $('#id_product').val(null).trigger('change');
                    $('#status').val('');
                    $('#sts_pasang').val('');
                    $('#customers').val(null).trigger('change');
                    $('#mesin_lama').val('');
                    $('#so_oke').val('');
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    }

</script>