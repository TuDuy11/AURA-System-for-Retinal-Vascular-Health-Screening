import logging

def setup_logging(): # create a funcion to setup logging 
    logging.basicConfig( #Hàm cấu hình logging toàn cục
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler("app.log"),
            logging.StreamHandler()# log hiện trực tiếp trên màn hình 
        ]
    )

setup_logging() # gọi hàm setup_logging để thiết lập logging khi module được import