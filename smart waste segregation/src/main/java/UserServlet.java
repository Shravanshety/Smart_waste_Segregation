import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import model.User;

public class UserServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if ("signup".equals(action)) {
            handleSignup(request, response);
        } else if ("login".equals(action)) {
            handleLogin(request, response);
        }
    }
    
    private void handleSignup(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String email = request.getParameter("email");
        
        User user = new User(username, password, email, "USER");
        
        // Save to database (simplified)
        try {
            Connection conn = DriverManager.getConnection("jdbc:sqlite:waste_db.sqlite");
            String sql = "INSERT INTO users (username, password, email, role, qr_code) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, email);
            stmt.setString(4, "USER");
            stmt.setString(5, QRCodeHandler.generateUserQRCode(user.getId()));
            stmt.executeUpdate();
            
            response.sendRedirect("login.html");
        } catch (SQLException e) {
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
    
    private void handleLogin(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        try {
            Connection conn = DriverManager.getConnection("jdbc:sqlite:waste_db.sqlite");
            String sql = "SELECT * FROM users WHERE username = ? AND password = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                HttpSession session = request.getSession();
                session.setAttribute("userId", rs.getInt("id"));
                session.setAttribute("role", rs.getString("role"));
                
                String role = rs.getString("role");
                switch (role) {
                    case "ADMIN":
                        response.sendRedirect("dashboard-admin.html");
                        break;
                    case "COLLECTOR":
                        response.sendRedirect("dashboard-collector.html");
                        break;
                    default:
                        response.sendRedirect("dashboard-user.html");
                }
            } else {
                response.sendRedirect("login.html?error=invalid");
            }
        } catch (SQLException e) {
            response.getWriter().println("Error: " + e.getMessage());
        }
    }
}