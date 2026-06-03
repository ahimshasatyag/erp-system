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
                <div class="row">
                    <div class="col-xl-12">
                        <div class="float-left">

                            <?php if (check_role($this->id_menu, 1)) {?><a href="#"
                                onclick="show('<?=$folder;?>/cform/tambah/','#main'); return false;"
                                class="btn btn-success btn-sm pull-right"><i class="fa fa-plus"></i> &nbsp;Add New</a>
                            <?php }?>
                        </div>
                        </br>
                        </br>
                        <!-- <div class="table-responsive"> -->
                        <table class="table-sm table-striped table-bordered table-bordered dt-responsive nowrap"
                            style="border-collapse: collapse; border-spacing: 0; width: 100%;" id="tabledata"
                            cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Customers Name</th>
                                    <th>Create By</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                        <!-- </div> -->
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>

<script>
$(document).ready(function() {
    datatable('#tabledata', base_url + '<?=$folder;?>/Cform/data');
});
</script>