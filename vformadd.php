<div class="container-fluid">

    <div class="row">
        <div class="col-12">
            <div class="page-title-box">
                <h4 class="page-title"><?=$title;?></h4>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <div class="card-box">

                <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/simpan'), 'update' => '#pesan', 'type' => 'post')); ?>
                <div class="row">
                    <div class="col-xl-12">
                        <div id="pesan">

                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="form-group row">
                            <label class="col-lg-3 col-form-label col-form-label-sm">Customers</label>
                            <div class="col-lg-9">
                                <select class="form-control form-control-sm" id="id_customers" name="id_customers">
                                    <option></option>
                                    <?php if ($data_customers) {
    foreach ($data_customers->result() as $row) {?>
                                    <option value="<?=$row->id_customers;?>"><?=$row->nm_customers;?> </option>
                                    <?php }
}?>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="form-group row">
                            <label class="col-lg-3 col-form-label col-form-label-sm">Date</label>
                            <div class="col-lg-9">
                                <input class="form-control form-control-sm tanggal" type="text" name="date_log_book"
                                    required readonly value="<?=date('d-m-Y');?>">
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Complaint</label>
                            <div class="col-lg-11">
                                <textarea id="masalah" name="masalah" type="text" class="form-control form-control-sm"
                                    rows="5" required></textarea>
                                <input type="hidden" name="masalah_hidden" id="masalah_hidden" value="" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Feedback</label>
                            <div class="col-lg-11">
                                <textarea id="solusi" name="solusi" type="text" class="form-control form-control-sm"
                                    rows="5" required></textarea>
                                <input type="hidden" name="solusi_hidden" id="solusi_hidden" value="" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Note</label>
                            <div class="col-lg-11">
                                <textarea id="catatan" name="catatan" type="text" class="form-control form-control-sm"
                                    rows="5" required></textarea>
                                <input type="hidden" name="catatan_hidden" id="catatan_hidden" value="" />
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12 text-center">
                        <button class="btn btn-success btn-sm" type="submit" value="Simpan" name="simpan" id="submit"
                            onclick="return cek_submit();">Simpan</button>
                        <a href="#" onclick="show('<?=$folder;?>/cform/','#main'); return false;"
                            class="btn btn-warning btn-sm pull-right"><i class="fa fa-undo"></i>
                            &nbsp;Kembali</a>
                    </div>
                </div>
                </form>
                <!-- End Row -->
            </div>
        </div>

    </div>
</div>

<script src="<?=base_url();?>assets/libs/ckeditor/ckeditor.js"></script>
<script src="<?=base_url();?>assets/libs/ckeditor/plugins/filebrowser/plugin.js"></script>

<script type="text/javascript">
$(document).ready(function() {
    showCalendar('.tanggal');
    $('#id_customers').select2({
        placeholder: "Select Customers",
    });
    let masalah = CKEDITOR.replace('masalah', {
        filebrowserUploadUrl: "<?=base_url() . $folder;?>/cform/upload_gambar",
        filebrowserUploadMethod: "form"
    });
    let solusi = CKEDITOR.replace('solusi', {
        filebrowserUploadUrl: "<?=base_url() . $folder;?>/cform/upload_gambar",
        filebrowserUploadMethod: "form"
    });
    let catatan = CKEDITOR.replace('catatan', {
        filebrowserUploadUrl: "<?=base_url() . $folder;?>/cform/upload_gambar",
        filebrowserUploadMethod: "form"
    });


});


$("form").submit(function(event) {
    event.preventDefault();
    $("input").attr("disabled", true);
    $("select").attr("disabled", true);
    $("#submit").attr("disabled", true);
});

function cek_submit() {
    let masalah = CKEDITOR.instances['masalah'].getData();
    let solusi = CKEDITOR.instances['solusi'].getData();
    let catatan = CKEDITOR.instances['catatan'].getData();
    if (masalah.length < 1) {
        alert('Masalah Wajib Diisi !');
        return false;
    }
    if (solusi.length < 1) {
        alert('Solusi Wajib Diisi !');
        return false;
    }
    $('#masalah_hidden').val(masalah);
    $('#solusi_hidden').val(solusi);
    $('#catatan_hidden').val(catatan);
}
</script>