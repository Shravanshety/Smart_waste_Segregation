import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import java.util.Base64;

public class QRCodeHandler {
    
    public static String generateQRCode(String data) {
        // Simple QR code generation using Google Charts API
        String qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + data;
        return qrUrl;
    }
    
    public static String generateUserQRCode(int userId) {
        return generateQRCode("USER_ID:" + userId);
    }
    
    public static int extractUserIdFromQR(String qrData) {
        if (qrData.startsWith("USER_ID:")) {
            return Integer.parseInt(qrData.substring(8));
        }
        return -1;
    }
}