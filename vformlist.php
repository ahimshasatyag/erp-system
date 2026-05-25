<div class="row">
    <div class="col-12">
        <div class="page-title-box">
            <div class="page-title-right">
                <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item"><a href="javascript: void(0);">EMM Service</a></li>
                    <li class="breadcrumb-item"><a href="javascript: void(0);">CSR</a></li>
                    <li class="breadcrumb-item active">CSR</li>
                </ol>
            </div>
            <h2 class="page-title"><b><?= $title; ?></b></h2>
        </div>
    </div>
</div>
<!-- end page title -->

<div class="row">
    <div class="col-12">
        <div class="card-box">
            <?php if (check_role($this->id_menu, 1)) { ?><a href="#" onclick="show('<?= $folder; ?>/cform/tambah/','#main'); return false;" class="fas fa-plus btn btn-success btn-sm">&nbsp;Add New</a>
            <?php } ?>
            <?php echo $this->pquery->form_remote_tag(array('url' => site_url($folder . '/cform/index'), 'update' => '#main', 'type' => 'get')); ?>
            <input type="hidden" name="search" value="<?= $search ?>">
            <div class="form-inline mt-4 mb-4">
                <div class="form-group mr-2">
                    <label for="start_date" class="mr-2">Dari tanggal:</label>
                    <input type="date" class="form-control" id="start_date" name="start_date" value="<?= isset($_GET['start_date']) ? htmlspecialchars($_GET['start_date']) : date('Y-m-01'); ?>">
                </div>
                <div class="form-group mr-2">
                    <label for="end_date" class="mr-2">Sampai tanggal:</label>
                    <input type="date" class="form-control" id="end_date" name="end_date" value="<?= isset($_GET['end_date']) ? htmlspecialchars($_GET['end_date']) : date('Y-m-d'); ?>">
                </div>
                <div class="form-group mr-2">
                    <label for="status" class="mr-2">Status:</label>
                    <select class="form-control" id="status" name="status">
                        <option value="">All Status</option>
                        <option value="DRAFT" <?= isset($_GET['status']) && $_GET['status'] == 'DRAFT' ? 'selected' : '' ?>>Draft CSR</option>
                        <option value="OUTSTANDING" <?= isset($_GET['status']) && $_GET['status'] == 'OUTSTANDING' ? 'selected' : '' ?>>Outstanding</option>
                        <option value="CANCEL" <?= isset($_GET['status']) && $_GET['status'] == 'CANCEL' ? 'selected' : '' ?>>CANCELED</option>
                        <option value="DONE" <?= isset($_GET['status']) && $_GET['status'] == 'DONE' ? 'selected' : '' ?>>DONE</option>
                    </select>
                </div>
                <!-- checkbox all -->
                <div class="form-group mr-2">
                      <label for="all" class="mr-2">All:</label>
                      <input type="checkbox" class="form-control" id="all" name="all" value="all" <?= isset($_GET['all']) ? 'checked' : '' ?>>
                  </div>
                <button type="submit" class="btn btn-primary">Filter</button>
            </div>
            </form>

            <div class="table-responsive">
                <table class="table-sm table-striped table-bordered table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;" id="datatable" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th width="10%">Date</th>
                            <th>Age In</th>
                            <th>Request</th>
                            <th>Customers</th>
                            <th>Product Name</th>
                            <th>Request</th>
                            <th>User</th>
                            <th width="5%">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $no = 1;
                        if ($isi->num_rows() > 0) {
                            foreach ($isi->result() as $row) {
                                if (in_array($row->csr_status, ['IN PROGRESS'])) {
                                    continue;
                                }

                                $csr_code_tmp = $row->csr_code;
                                $csr_code_tmp = str_replace("/", ".", $csr_code_tmp);
                        ?>
                                <tr>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= $no++ ?></a></td>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= date('d-M-Y', strtotime($row->csr_date)); ?></a></td>
                                    <td>
                                        <a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'>
                                            <?php
                                            $csrDateVal = $row->csr_date;
                                            if (!empty($csrDateVal)) {
                                                $diffDays = floor((strtotime(date('Y-m-d')) - strtotime($csrDateVal)) / (60 * 60 * 24));
                                                echo $diffDays;
                                            } else {
                                                echo '';
                                            }
                                            ?>
                                        </a>
                                    </td>
                                    <td><b><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= substr($row->csr_code, 16); ?></b></a></td>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= $row->nm_customers; ?></a></td>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= $row->code_product; ?></a></td>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= $row->nm_karyawan; ?></a></td>
                                    <td><a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'><?= $row->csr_by; ?></a></td>
                                    <td>
                                        <a href="#" onclick='show("<?= $folder; ?>/cform/edit/<?= $csr_code_tmp; ?>/f","#main"); return false;'>
                                        <?php
                                        $statusFilter = isset($_GET['status']) ? $_GET['status'] : '';
                                        $sts2 =  $row->csr_status;
                                        // $f_cancel = $row->f_cancel;

                                        // if (!$f_cancel) {
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
                                    }
                                        ?>
                                        </a>
                                    </td>
                                </tr>
                            <?php
                        }
                            ?>

                    </tbody>
                </table>
            </div>
        </div> <!-- end row -->

        <style>
            .dataTables_length,
            .dataTables_copy {
                margin-right: 20px;
                /* Adjust the margin as needed */
            }
        </style>

        <script>
            $(document).ready(function() {
                var table = $('#datatable').DataTable({
                    "order": [
                        [0, "desc"]
                    ],
                    "dom": 'lBfrtip',
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, 'All']
                    ],
                    "buttons": [{
                            extend: 'copyHtml5',
                            text: 'Copy', // Set the text for the Copy button
                        },
                        // 'excelHtml5',
                        // 'csvHtml5',
                        // 'pdfHtml5',
                        // 'print'
                    ],
                });
                $('#status').on('change', function() {
                    var statusFilter = $(this).val();
                    table.column(8).search(statusFilter).draw();
                });
            });
        </script>