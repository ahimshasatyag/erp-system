<!-- LIST LAPORAN VISIT /  REALISASI SERVICE -->
<div class="row">
    <div class="col-12">
        <div class="card-box">



            <?php
            $tmbol = $row->flag_done;
            $tmbol2 = $row->status;
            
            if ($tmbol === 'ON PROGRESS') {
            // if ($tmbol2 === 'Draft' || ($tmbol === 'Draft' && $tmbol !== 'DONE' && $tmbol !== 'ON PROGRESS')) {
                echo '<a href="#" onclick="show(\'' . $folder . '/cform/tambahvisit/' . $lkt_code_tmp . '\', \'#main\');" class="fas fa-plus btn btn-success btn-sm" style="margin-bottom: 5px"> Add New</a>';
            }
            ?>



            <div class="table-responsive">
                <table class="table-sm table-striped table-bordered table-bordered dt-responsive nowrap" style="border-collapse: collapse; border-spacing: 0; width: 100%;" id="datatable" cellspacing="0" width="100%">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th width="8%">LKT</th>
                            <th width="8%">CST</th>
                            <!-- <th >Customers</th> -->
                            <th width="10%">St Date</th>
                            <th>Customers</th>
                            <th>Keterangan</th>
                            <th width="10%">Training</th>
                            <th width="10%">Bongkar</th>
                            <th>Daring</th>
                            <th width="5%">Sts</th>

                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $no = 1;
                        foreach ($vst->result() as $row) {

                            $lkt_sub_code_tmp = $row->lkt_sub_code;
                            $sts2 = $row->flag_done;

                            $flag_status = 'f';

                            if ($row->status == 'Draft') {
                                $flag_status = 't';
                            }

                        ?>
                            <tr>
                                <td><?php echo $no++; ?></td>
                                <td><b><a href="#" onclick="show('<?php echo $folder; ?>/cform/visitlktdetail/<?php echo $lkt_sub_code_tmp; ?>/f','#main'); return false;"><?php echo substr($row->lkt_code, 16); ?></a></b></td>
                                <td><?php echo substr($row->cst_code, 16); ?></td>
                                <!-- <td></td> -->
                                <td><?php echo $row->actual_starting_date; ?></td>
                                <td><?php echo substr($row->nm_customers, 0, 40); ?></td>
                                <td><?php echo substr($row->actual_description, 0, 40); ?></td>
                                <td>
                                    <?php echo is_numeric($row->actual_training) ? number_format($row->actual_training, 0, '', '.') : $row->actual_training; ?>
                                </td>
                                <td>
                                    <?php echo is_numeric($row->actual_bongkar) ? number_format($row->actual_bongkar, 0, '', '.') : $row->actual_bongkar; ?>
                                </td>
                                <td>
                                    <?php
                                    if ($row->flag_daring == 1) {
                                        echo '<span class="badge badge-success">Daring</span>';
                                    } else {
                                        echo '<span class="badge badge-secondary">Tidak</span>';
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    $sts2 = $row->status;
                                    if ($row->f_cancel == 0) {
                                        if ($sts2 == 'OUTSTANDING') {
                                            echo '<span style="width: 75px" class="badge badge-info">Outstanding</span>';
                                        } elseif ($sts2 == 'ON PROGRESS') {
                                            echo '<span style="width: 75px" class="badge badge-warning">In Progress</span>';
                                        } elseif ($sts2 == 'CLOSE') {
                                            echo '<span style="width: 75px" class="badge badge-success">CLOSE</span>';
                                        } elseif ($sts2 == 'Draft') {
                                            echo '<span style="width: 75px" class="badge badge-dark">Draft</span>';
                                        } elseif ($sts2 == 'CANCEL') {
                                            echo '<span style="width: 75px" class="badge badge-danger">Cancel</span>';
                                        } else {
                                            echo '';
                                        }
                                    } else {
                                        echo '<span style="width: 75px" class="badge badge-danger">Cancel</span>';
                                    }
                                    ?>
                                </td>
                            </tr>
                        <?php }

                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div> <!-- end row-->
    <!-- 
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
        });
    </script> -->