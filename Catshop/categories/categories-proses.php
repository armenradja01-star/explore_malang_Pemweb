<?php 
if(isset($_POST['simpan'])) {
    $categories = $_POST['categories'];
    $price = $_POST['price'];
    $description= $_POST['description'];
    $image = $_FILES['photo']['name'];

    echo
    'Categories : ' . $categories . 
    '<br> Price : ' . $price .
    '<br> Description : '. $description .
    '<br> File name : ' . $image; 
}
?>
