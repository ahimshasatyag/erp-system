  <!-- DETAIL CSR -->
  <br>
  <?php
    if ($isi->num_rows() > 0) {
        foreach ($isi->result() as $row) {
            $csr_code_tmp = $row->csr_code;
            $csr_code_tmp = str_replace("/", ".", $csr_code_tmp);

            $selected_karyawan_id = $row->id_karyawan;
            $cm_tmp = $row->id_customers;
            $sts_pasang = $row->sts_pasang;
    ?>
          <div class="row">
              <div class="col-sm-12">
                  <div class="card-box">
                      <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/update/'), 'update' => '#pesan', 'type' => 'post', 'processData' => 'false', 'contentType' => 'false', 'upload' => 'true')); ?>
                      <div>
                          <!-- <input  type="submit" name="simpan" value="Submit" class="btn btn-primary"> -->
                          <input type="hidden" name="csr_code" id="csr_code" value="<?php echo $row->csr_code; ?>">



                          <?php
                            $sts2 = $row->csr_status;
                            $csr_code = $row->csr_code;

                            if ($sts2 == 'DRAFT' && check_role($this->id_menu, 3)) {
                                if (!$f_edit) {
                                    echo '<a style="width: 100px" href="#" onclick="show(\'' . $folder . '/cform/\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                                    echo '<a style="width: 100px; margin-left:5px" href="#" onclick="show(\'' . $folder . '/cform/edit/' . $csr_code_tmp . '/t\', \'#main\');" class="fas fa-edit btn btn-warning btn-sm waves-effect waves-light"> Edit</a>';
                                    echo '<button style="width: 110px; margin-left:5px" class="fas fa-check btn btn-success btn-sm" type="button" onclick="return confirm_csr(\'' . $row->csr_code . '\');"> Confirm</button>';
                                    echo '<button style="width: 110px; margin-left:5px" class="fas fa-times btn btn-danger btn-sm cancel-btn" type="button" onclick="return cancel(\'' . $row->csr_code . '\');"> Cancel</button>';
                                } else {
                                    // echo '<button class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light" type="button" onclick="show(\'' . $folder . '/cform/edit/' . $csr_code_tmp . '/f\',\'#main\');"> Back</button>';
                                    echo '<a style="width: 100px;margin-right:5px" href="#" onclick="show(\'' . $folder . '/cform/edit/' . $csr_code_tmp . '/f\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                                    echo '<button style="width: 110px; margin-left:5px" class="fas fa-check btn btn-success btn-sm" type="button" onclick="return simpan(\'' . $row->csr_code . '\'); return false;"> Save</button>';
                                }
                            } elseif ($sts2 == 'OUTSTANDING' && check_role($this->id_menu, 3)) {
                                if ($row->approved_csr_by == null) {
                                    if (!$f_edit) {
                                        echo '<a style="width: 100px" href="#" onclick="show(\'' . $folder . '/cform/\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                                        echo '<a style="width: 100px; margin-left:5px" href="#" onclick="show(\'' . $folder . '/cform/edit/' . $csr_code_tmp . '/t\', \'#main\');" class="fas fa-edit btn btn-warning btn-sm waves-effect waves-light"> Edit</a>';
                                        echo '<button style="width: 110px; margin-left:5px" class="fas fa-check btn btn-success btn-sm" type="button" onclick="return confirm_csr(\'' . $row->csr_code . '\'); return false;"> Confirm</button>';
                                        echo '<button style="width: 110px; margin-left:5px" class="fas fa-times btn btn-danger btn-sm cancel-btn" type="button" onclick="return cancel(\'' . $row->csr_code . '\');">  Cancel</button>';
                                    } else {
                                        echo '<a style="width: 100px;margin-right:5px" href="#" onclick="show(\'' . $folder . '/cform/edit/' . $csr_code_tmp . '/f\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                                        echo '<button style="width: 110px; margin-left:5px" class="fas fa-check btn btn-success btn-sm" type="button" onclick="return simpan(\'' . $row->csr_code . '\'); return false;"> Save</button>';
                                    }
                                } else {
                                    echo '<a style="width: 100px" href="#" onclick="show(\'' . $folder . '/cform/\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                                }
                            } elseif ($sts2 == 'CANCEL' || $sts2 == 'DONE') {
                                echo '<a style="width: 100px" href="#" onclick="show(\'' . $folder . '/cform/\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                            } else {
                                echo '<a style="width: 100px" href="#" onclick="show(\'' . $folder . '/cform/\',\'#main\'); return false;" class="fa fa-undo btn btn-primary btn-sm waves-effect waves-light"> Back</a>';
                            }
                            ?>


                      </div>
                      <div style="width: 85%" class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">
                          <h3 class=" m-t-0 m-b-30"><b><?= $row->csr_code; ?></b></h3>
                          <h5><b>Status :
                                  <?php
                                    $sts2 =  $row->csr_status;
                                    if ($sts2 == 'DRAFT') {
                                        echo '<span style="width: 75px" class="badge  badge-dark">Draft CSR</span>';
                                    } elseif ($sts2 == 'OUTSTANDING') {
                                        echo '<span  style="width: 75px" class="badge  badge-warning">Outstanding</span>';
                                    } elseif ($sts2 == 'CANCEL') {
                                        echo '<span  style="width: 75px" class="badge  badge-danger">CANCELED</span>';
                                    } elseif ($sts2 == 'DONE') {
                                        echo '<span  style="width: 75px" class="badge  badge-success">DONE</span>';
                                    } else {
                                        echo $sts2;
                                    }
                                    ?>
                              </b></h5>

                      </div>

                      <h5 class=" m-t-0 m-b-30"><b>Customer</b></h5>
                      <div class="row">
                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6">
                              <table class="table table-sm table-striped">

                                  <tbody>
                                      <tr>
                                          <th width="27%">Customers Name <span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <th>
                                              <select class="form-control form-control-sm" name="customers" id="customers" <?= ($f_edit) ? 'required' : ''; ?> <?= ($f_edit) ? '' : 'disabled'; ?>>
                                                  <?php if ($f_edit) : ?>
                                                      <?php foreach ($data_customers->result() as $data) : ?>
                                                          <?php
                                                            $sb_code = $data->id_customers;
                                                            $sb_name = $data->nm_customers;
                                                            $sb_name2 = substr($data->customers_address, 0, 100);
                                                            if ($sb_code == $cm_tmp) {
                                                                 echo "<option value='" . $sb_code . "' data-provinsi='" . $data->provinsi . "' selected>" . $sb_name . ' --> ' . $sb_name2 . "</option>";
                                                            } else {
                                                                 echo "<option value='" . $sb_code . "' data-provinsi='" . $data->provinsi . "'>" . $sb_name . ' --> ' . $sb_name2 . "</option>";
                                                            }
                                                            ?>
                                                      <?php endforeach; ?>
                                                  <?php else : ?>
                                                      <option><?= $row->nm_customers . ' --> ' . $row->customers_address; ?></option>
                                                      <input type="hidden" name="customer" id="customer" value="<?php echo $row->id_customers; ?>">
                                                  <?php endif; ?>
                                              </select>


                                              <br>
                                          </th>
                                      </tr>
                                      <tr>
                                          <th scope="row">Requestor<span class="text-danger"> *</span></th>
                                          <th>:</th>
                                          <td>
                                              <select class="form-control form-control-sm" name="id_karyawan" id="id_karyawan" <?= ($f_edit) ? 'required' : ''; ?> <?= ($f_edit) ? '' : 'disabled'; ?>>
                                                  <?php if ($f_edit) : ?>
                                                      <?php if ($data_karyawan) : ?>
                                                          <?php foreach ($data_karyawan->result() as $data2) : ?>
                                                              <?php
                                                                $sb_code = $data2->id_karyawan;
                                                                $sb_name = $data2->nm_karyawan;
                                                                if ($sb_code == $row->id_karyawan) {
                                                                    echo "<option value='" . $sb_code . "' selected>" . $sb_name . "</option>";
                                                                } else {
                                                                    echo "<option value='" . $sb_code . "'>" . $sb_name . "</option>";
                                                                }
                                                                ?>
                                                          <?php endforeach; ?>
                                                      <?php endif; ?>
                                                  <?php else : ?>
                                                      <option><?= $row->nm_karyawan; ?></option>
                                                  <?php endif; ?>
                                              </select>

                                          </td>
                                      </tr>
                                      <tr>
                                          <?php
                                            if ($isi->num_rows() > 0) {
                                                foreach ($isi->result() as $row) {
                                                    $csr_code_tmp = $row->csr_code;
                                                    $csr_code_tmp = str_replace("/", ".", $csr_code_tmp);
                                                }
                                            }
                                            ?>
                                          <th width="27%">Created Date<span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <th><?php echo  date_format(date_create($row->csr_input_date), "d-M-Y"); ?></th>
                                      </tr>
                                  </tbody>
                              </table>
                          </div><!-- end col -->

                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                              <table class="table table-sm table-striped">
                                  <thead>
                                      <tr>
                                          <th width="27%">Date Request <span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <th>
                                              <input style="width: 150px" value="<?php echo $row->csr_date ?>" type="date" required name="csr_date" id="csr_date" class="form-control form-control-sm" placeholder="DD-MMM-YYYY" <?php if (!$f_edit) {
                                                                                                                                                                                                                                        echo 'readonly';
                                                                                                                                                                                                                                    } ?>>

                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <th scope="row">Lokasi<span class="text-danger"> *</span></th>
                                          <th>:</th>
                                          <td><label class="radio-inline">
                                                  <input <?= ($f_edit) ? 'required' : ''; ?> <?= ($f_edit) ? '' : 'disabled'; ?> type="radio" name="lokasi" id="lokasi_dalam" value="Dalam Kota" <?= ($row->lokasi == 'Dalam Kota') ? 'checked' : ''; ?>>
                                                  <b> Dalam Kota</b><br></label>
                                              <label style="margin-left: 1%" class="radio-inline">
                                                  <input <?= ($f_edit) ? 'required' : ''; ?> <?= ($f_edit) ? '' : 'disabled'; ?> type="radio" name="lokasi" id="lokasi_luar" value="Luar Kota" <?= ($row->lokasi == 'Luar Kota') ? 'checked' : ''; ?> <?= (!$f_edit) ? 'readonly' : ''; ?>>
                                                  <b> Luar Kota</b>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td scope="row">Status Pemasangan<span class="text-danger"> *</span></td>
                                          <th>:</th>
                                          <td>
                                               <input <?= ($f_edit) ? '' : 'disabled'; ?> type="radio" name="sts_pasang" id="sts_pasang_baru" value="1" <?= ($sts_pasang == '1') ? "checked" : ""; ?> /><b> Pasang Baru</b><br>
                                               <input <?= ($f_edit) ? '' : 'disabled'; ?> type="radio" name="sts_pasang" id="sts_pasang_service" value="0" <?= ($sts_pasang == '0') ? "checked" : ""; ?> /><b> Service</b>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>

                          </div> <!-- end col -->
                      </div><!-- end row -->



                      <fieldset class="form-group">

                      </fieldset>
                      <h5 class=" m-t-0 m-b-30"><b>Laporan Kerusakan</b></h5>
                      <div class="row">
                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6">
                              <table class="table table-sm table-striped">
                                  <tbody>
                                      <tr>
                                          <th width="27%">Catatan Kerusakan <span class="text-danger"> *</span></th>
                                          <th width="5%">:</th>
                                          <th> <textarea class="form-control form-control-sm" name="lap_kerusakan" id="lap_kerusakan" rows="3" required <?php if (!$f_edit) {
                                                                                                                                                            echo 'readonly';
                                                                                                                                                        } ?>><?php echo $row->lap_kerusakan ?></textarea>

                                          </th>
                                      </tr>
                                  </tbody>
                              </table>
                          </div><!-- end col -->

                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                              <table class="table table-sm table-striped">
                                  <tbody>
                                      <tr>
                                          <th width="27%">Images <span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <td>
                                              <?php
                                                $link_foto = $row->image;
                                                ?>
                                              <div class="col-xl-1">
                                                  <div style="padding: 0;position: relative;display: inline-block;width: auto;vertical-align: top;">
                                                      <label <?php if ($f_edit == 't') { ?> for="link_foto" <?php } ?>>
                                                          <img src="<?php if ($link_foto == null) { ?><?= base_url(); ?>assets/images/placeholder.png <?php } else { ?><?= base_url(); ?>assets/upload/afs/<?= $link_foto; ?> <?php } ?>" class="image-product" id="link_foto_preview" onclick="openImageInNewTab(this)">
                                                      </label>
                                                      <input type="file" style="visibility:hidden;" id="link_foto" accept="image/*" />
                                                      <!-- <progress id="progressBar" value="0" max="100" style="width:300px;"></progress>
                                                      <h3 id="status"></h3>
                                                      <p id="total"></p> -->
                                                  </div>
                                              </div>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div> <!-- end col -->
                      </div><!-- end row -->

                      <h5 class=" m-t-0 m-b-30"><b>Product To Service</b></h5>
                      <div class="row">
                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6">
                              <table class="table table-sm table-striped">
                                  <thead>
                                      <tr>
                                          <th width="27%">Serial Number <span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <th><?php echo $row->barcode ?></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <th scope="row">Product Name<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <input type="hidden" name="product" id="product" value="<?php echo $row->id_product; ?>">
                                          <td><?php echo $row->code_product ?></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Product Category<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <td><?php echo $row->nm_product_kategori; ?></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Delivery Order<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <td><?php echo $row->do_code; ?></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Internal Notes SO</th>
                                          <th>:</th>
                                          <td><?php echo $row->internal_notes; ?></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div><!-- end col -->

                          <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12 col-xl-6 m-t-sm-40">

                              <table class="table table-sm table-striped">
                                  <thead>
                                      <tr>
                                          <th width="27%">Warranty Start <span class="text-danger"> </span></th>
                                          <th width="5%">:</th>
                                          <th><?php echo  date_format(date_create($row->waranty_start), "d-M-Y"); ?></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <th scope="row">Warranty Time<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <td><?php echo $row->waranty_time; ?></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Warranty End<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <td><?php echo  date_format(date_create($row->waranty_end), "d-M-Y"); ?></td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Warranty Status<span class="text-danger"> </span></th>
                                          <th>:</th>
                                          <td>
                                              <?php
                                                $grn = $row->waranty_end;
                                                $grn2 = date('Y-m-d', strtotime($row->csr_date));
                                                if ($grn >= $grn2) {
                                                    echo '<b style="color: green;">GARANSI</b>';
                                                } else {
                                                    echo '<b style="color: red;">TIDAK GARANSI</b>';
                                                }
                                                ?>
                                          </td>
                                      </tr>
                                      <tr>
                                          <th scope="row">Keterangan SO</th>
                                          <th>:</th>
                                          <td><?php echo $row->keterangan; ?></td>
                                      </tr>
                              <?php }
                        }
                                ?>
                                  </tbody>
                              </table>
                          </div> <!-- end col -->
                      </div><!-- end row -->
                      <br>
                      <h5 class="m-t-0 m-b-30"><b>CST List</b> &nbsp;
                        <?php
                        $all_cancel = true;
                        if (isset($isi2) && $isi2->num_rows() > 0) {
                            foreach ($isi2->result() as $row2) {
                                if ($row2->status != 'CANCEL') {
                                    $all_cancel = false;
                                    break;
                                }
                            }
                        } else {
                            $all_cancel = false;
                        }

                        if ($all_cancel && $row->csr_status != 'CANCEL' && !$f_edit) {
                        ?>
                            <button type="button" class="btn btn-success btn-xs" onclick="add_new_cst('<?= $row->csr_code; ?>')"><i class="fa fa-plus"></i> Add New CST</button>
                        <?php } ?>
                      </h5>
                      <div class="row">
                          <div class="col-12">
                              <table class="table table-sm table-striped table-bordered">
                                  <thead>
                                      <tr>
                                          <th width="5%" class="text-center">No</th>
                                          <th class="text-center">CST Code</th>
                                          <th class="text-center">Date</th>
                                          <th class="text-center">Product Name</th>
                                          <th class="text-center">Request</th>
                                          <th class="text-center">User</th>
                                          <th class="text-center">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <?php
                                      $no = 1;
                                      if (isset($isi2) && $isi2->num_rows() > 0) {
                                          foreach ($isi2->result() as $row2) {
                                      ?>
                                              <tr>
                                                  <td class="text-center"><?= $no++; ?></td>
                                                  <td><a href="#" onclick="show('cst/cform/edit/<?= str_replace('/', '.', $row2->cst_code); ?>/f','#main'); return false;"><?= $row2->cst_code; ?></a></td>
                                                  <td class="text-center"><?= date('d-M-Y', strtotime($row2->cst_date)); ?></td>
                                                  <td><?= $row2->code_product . ' - ' . $row2->nm_product; ?></td>
                                                  <td><?= $row2->nm_karyawan; ?></td>
                                                  <td><?= $row2->approved_csr_by; ?></td>
                                                  <td class="text-center">
                                                      <?php
                                                      $sts = $row2->status;
                                                      if ($sts == 'OUTSTANDING') {
                                                          echo '<span class="badge badge-info">Outstanding</span>';
                                                      } elseif ($sts == 'ON PROGRESS') {
                                                          echo '<span class="badge badge-warning">In Progress</span>';
                                                      } elseif ($sts == 'DONE') {
                                                          echo '<span class="badge badge-success">Done</span>';
                                                      } elseif ($sts == 'CANCEL') {
                                                          echo '<span class="badge badge-danger">Cancelled</span>';
                                                      } elseif ($sts == 'PENDING') {
                                                          echo '<span class="badge badge-dark">Pending</span>';
                                                      } else {
                                                          echo '<span class="badge badge-secondary">' . $sts . '</span>';
                                                      }
                                                      ?>
                                                  </td>
                                              </tr>
                                      <?php
                                          }
                                      } else {
                                          echo '<tr><td colspan="7" class="text-center">No data found</td></tr>';
                                      }
                                      ?>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
              </form>
          </div>

          <script>
              $(document).ready(function() {

                  $("#id_karyawan").select2({
                      placeholder: "Select Karyawan",
                      allowClear: true
                  });


                  $("#id_customers").select2({
                      placeholder: "Select Customers",
                      allowClear: true
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
                          }
                      }
                  });

              });
          </script>

          <script>
              $("form").submit(function(event) {
                  event.preventDefault();
                  $("input").attr("disabled", true);
                  $("select").attr("disabled", true);
                  $("#submit").attr("disabled", true);
              });



              function simpan(csr_code) {
                  const customers = $("#customers").val();
                  const sts_pasang = $("input[name='sts_pasang']:checked").val();
                  const csr_date = $("#csr_date").val();
                  const id_karyawan = $("#id_karyawan").val();
                  const lokasi = $("input[name='lokasi']:checked").val();
                  const lap_kerusakan = $("#lap_kerusakan").val();

                  if (!customers || !sts_pasang || !csr_date || !id_karyawan || !lokasi || !lap_kerusakan) {
                      Swal.fire("Gagal", "Harap lengkapi semua data wajib", "warning");
                      return false;
                  }

                  Swal.fire({
                      title: "Simpan edit?",
                      text: "Simpan untuk merubah!",
                      type: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#16987E",
                      confirmButtonText: "Ya, Simpan!",
                      cancelButtonText: "Tidak, batalkan!"
                  }).then((result) => {
                      if (result.value) {
                          // Mengambil nilai dari elemen-elemen input
                          const csr_code_val = $("#csr_code").val();

                          // Memeriksa apakah file baru dipilih
                          const fileInput = document.getElementById('link_foto');
                          const file = fileInput.files[0];

                          // Membuat objek FormData dan menambahkan data ke dalamnya
                          const formData = new FormData();
                          formData.append('csr_code', csr_code_val);
                          formData.append('customers', customers);
                          formData.append('sts_pasang', sts_pasang);
                          formData.append('csr_date', csr_date);
                          formData.append('id_karyawan', id_karyawan);
                          formData.append('lokasi', lokasi);
                          formData.append('lap_kerusakan', lap_kerusakan);

                          // Menambahkan file hanya jika file baru dipilih
                          if (file) {
                              formData.append('link_foto', file);
                          }

                          // Melakukan pengiriman data melalui AJAX
                          $.ajax({
                              type: "post",
                              data: formData,
                              processData: false,
                              contentType: false,
                              url: "<?= base_url('csr/cform/update'); ?>",
                              dataType: "json",
                              success: function(response) {
                                  if (response.status) {
                                      Swal.fire("Berhasil!", response.message, "success").then(() => {
                                          let editUrl = `<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f`;
                                          show(editUrl, "#main");
                                      });
                                  } else {
                                      Swal.fire("Gagal", response.message, "error");
                                  }
                              },
                              error: function() {
                                  Swal.fire("Maaf", "Data gagal di Confirm", "error");
                              }
                          });
                      }
                  });
              }

              function confirm_csr(csr_code) {
                  swal.fire({
                      title: "Confirm CSR ?",
                      text: "Apakah Anda Yakin akan menkonfirmasi CSR ini !",
                      type: "info",
                      showCancelButton: true,
                      confirmButtonColor: "#16987E",
                      confirmButtonText: "Ya, Confirm!",
                      cancelButtonText: "Tidak, batalkan!",
                  }).then((result) => {
                      if (result.value) {
                          const csr_code = $("#csr_code").val();
                          const customer = $("#customer").val();
                          const product = $("#product").val();

                          $.ajax({
                              type: "post",
                              data: {
                                  'csr_code': csr_code,
                                  'customer': customer,
                                  'product': product,
                              },
                              url: "<?= base_url('csr/cform/confirm'); ?>",
                              success: function(data) {
                                  let res = JSON.parse(data);
                                  swal.fire("Berhasil!", "Konfirmasi CSR Berhasil", "success");
                                  let editUrl = `cst/cform/edit/${res.cst_code}/f`;
                                  show(editUrl, "#main");
                              },
                              error: function() {
                                  swal.fire("Maaf", "Data gagal di Confirm ", "error");
                              }
                          });
                      }
                  });
              }

              function cancel(csr_code) {
                  swal.fire({
                      title: "Cancel CSR?",
                      html: '<input type="text" id="memo" class="swal2-input" placeholder="Alasan Cancel..." required>',
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Ya, Cancel!",
                      cancelButtonText: "Tidak, batalkan!",
                      preConfirm: () => {
                          const memo = document.getElementById('memo').value;

                          if (!memo) {
                              swal.showValidationMessage("Alasan Cancel harus diisi");
                          }

                          return {
                              memo: memo
                          };
                      }
                  }).then((result) => {
                      if (result.value) {
                          const csr_code = $("#csr_code").val();
                          const customer = $("#customer").val();
                          const product = $("#product").val();
                          const memo = result.value.memo; // Access the memo from the SweetAlert result

                          $.ajax({
                              type: "post",
                              data: {
                                  'csr_code': csr_code,
                                  'customer': customer,
                                  'product': product,
                                  'memo': memo, // Include the memo in the AJAX request
                              },
                              url: "<?= base_url('csr/cform/cancel'); ?>",
                              success: function(data) {
                                  swal.fire("Berhasil!", "Cancel CSR Berhasil", "success");
                                  let editUrl = `<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f`;
                                  show(editUrl, "#main");
                              },
                              error: function() {
                                  swal.fire("Maaf", "Data gagal di Cancel", "error");
                              }
                          });
                      }
                  });
              }

              function add_new_cst(csr_code) {
                  swal.fire({
                      title: "Add New CST?",
                      text: "Are you sure you want to add a new CST for this CSR?",
                      type: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#16987E",
                      confirmButtonText: "Yes, Add!",
                      cancelButtonText: "No, cancel!",
                  }).then((result) => {
                      if (result.value) {
                          $.ajax({
                              type: "post",
                              data: {
                                  'csr_code': csr_code,
                              },
                              url: "<?= base_url('csr/cform/add_new_cst'); ?>",
                              success: function(data) {
                                  let res = JSON.parse(data);
                                  swal.fire("Success!", "New CST added successfully", "success");
                                  let editUrl = `cst/cform/edit/${res.cst_code}/f`;
                                  show(editUrl, "#main");
                              },
                              error: function() {
                                  swal.fire("Error", "Data gagal di tambah", "error");
                              }
                          });
                      }
                  });
              }
          </script>

          <script>
              function readURL(input) {
                  if (input.files && input.files[0]) {
                      var reader = new FileReader();

                      reader.onload = function(e) {
                          $('#link_foto_preview').attr('src', e.target.result);
                      }

                      reader.readAsDataURL(input.files[0]); // convert to base64 string
                  }
              }

              $("#link_foto").change(function() {
                  readURL(this);
              });
          </script>

          <script>
              var clickCount = 0;

              function openImageInNewTab(image) {
                  clickCount++;

                  // Check if it's the second click (double-click)
                  if (clickCount === 2) {
                      var imageURL = image.src;
                      window.open(imageURL, '_blank');
                      clickCount = 0; // Reset click count after opening in a new tab
                  }
              }
          </script>

          <script>
            $("#customers").select2({ placeholder: "", allowClear: true });
          </script>


          <!-- <script>
              function uploadFile() {
                  var file = document.getElementById("link_foto").files[0];
                  var formdata = new FormData();
                  formdata.append("link_foto", file);

                  var ajax = new XMLHttpRequest();
                  ajax.upload.addEventListener("progress", progressHandler, false);
                  ajax.open("POST", "cform/simpan", true);
                  ajax.send(formdata);
              }

              function progressHandler(event) {
                  var percent = (event.loaded / event.total) * 100;
                  document.getElementById("progressBar").value = Math.round(percent);
                  document.getElementById("status").innerHTML = Math.round(percent) + "% telah terupload";
                  document.getElementById("total").innerHTML = "Telah terupload " + event.loaded + " bytes dari " + event.total;
              }
          </script> -->