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

                <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/update'), 'update' => '#pesan', 'type' => 'post')); ?>
                <div class="row">
                    <div class="col-xl-12">
                        <div id="pesan">

                        </div>
                    </div>
                    <div class="col-xl-6">
                        <div class="form-group row">
                            <label class="col-lg-3 col-form-label col-form-label-sm">Customers</label>
                            <div class="col-lg-9">
                                <input type="hidden" name="id_log_book" value="<?=$data->id_log_book;?>" />
                                <select class="form-control form-control-sm" id="id_customers" name="id_customers"
                                    <?php if (!$f_edit) {echo 'disabled';}?>>
                                    <option></option>
                                    <?php if ($data_customers) {
    foreach ($data_customers->result() as $row) {?>
                                    <option value="<?=$row->id_customers;?>"
                                        <?php if ($data->id_customers == $row->id_customers) {echo 'selected';}?>>
                                        <?=$row->nm_customers;?></option>
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
                                    required readonly value="<?=date("d-m-Y", strtotime($data->date_log_book));?>"
                                    <?php if (!$f_edit) {echo 'disabled';}?>>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Complaint</label>
                            <div class="col-lg-11">
                                <textarea id="masalah" name="masalah" type="text" class="form-control form-control-sm"
                                    rows="5" required
                                    <?php if (!$f_edit) {echo 'disabled';}?>><?=htmlspecialchars_decode($data->masalah);?></textarea>
                                <input type="hidden" name="masalah_hidden" id="masalah_hidden" value="" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Feedback</label>
                            <div class="col-lg-11">
                                <textarea id="solusi" name="solusi" type="text" class="form-control form-control-sm"
                                    rows="5" required
                                    <?php if (!$f_edit) {echo 'disabled';}?>><?=htmlspecialchars_decode($data->solusi);?></textarea>
                                <input type="hidden" name="solusi_hidden" id="solusi_hidden" value="" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-12">
                        <div class="form-group row">
                            <label class="col-lg-1 col-form-label col-form-label-sm">Note</label>
                            <div class="col-lg-11">
                                <textarea id="catatan" name="catatan" type="text" class="form-control form-control-sm"
                                    rows="5" required
                                    <?php if (!$f_edit) {echo 'disabled';}?>><?=htmlspecialchars_decode($data->catatan);?></textarea>
                                <input type="hidden" name="catatan_hidden" id="catatan_hidden" value="" />
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-12 text-center">
                        <?php if (check_role($this->id_menu, 3)) {
    if (!$f_edit) {?>
                        <button class="btn btn-info btn-sm" type="button"
                            onclick='show("<?=$folder;?>/cform/edit/<?=$data->id_log_book;?>/t","#main"); return false;'>Edit</button>
                        <?php } else {?>
                        <button class="btn btn-success btn-sm" type="submit" value="Simpan" name="simpan" id="submit"
                            onclick="return cek_submit();">Update</button>
                        <button class="btn btn-warning btn-sm" type="button"
                            onclick='show("<?=$folder;?>/cform/edit/<?=$data->id_log_book;?>/f","#main"); return false;'>Batal</button>
                        <?php }}if (check_role($this->id_menu, 4)) {if (!$f_edit) {?>
                        <button class="btn btn-danger btn-sm" type="button"
                            onclick="cancel('<?=$data->id_log_book;?>'); return false;">Hapus</button>
                        <?php }}?>
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

function cancel(id_log_book) {
    swal.fire({
        title: "Apakah anda yakin ?",
        text: "Anda tidak akan dapat memulihkan data ini!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Tidak, batalkan!",
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "post",
                data: {
                    'id_log_book': id_log_book,
                },
                url: "<?=base_url($folder . '/cform/delete');?>",
                success: function(data) {
                    swal.fire("Dihapus!", "Data berhasil dihapus ", "success");
                    show('<?=$folder;?>/cform/', '#main');
                },
                error: function() {
                    swal.fire("Maaf", "Data gagal dihapus ", "error");
                }
            });
        }
    });

};
</script>