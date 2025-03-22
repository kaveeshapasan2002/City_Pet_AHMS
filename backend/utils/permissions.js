// src/utils/permissions.js
export const checkPermission = (user, permission) => {
    if (!user) return false;
    

   

    // Admins have all permissions
    if (user.role === 'Admin') return true;
    
    // Check if user has the specific permission
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    // Fall back to role-based permissions if no specific permissions are set
    if (!user.permissions || user.permissions.length === 0) {
      return hasDefaultPermission(user.role, permission);
    }
    
    return false;
  };
  
  const hasDefaultPermission = (role, permission) => {
    const rolePermissions = getDefaultPermissionsForRole(role);
    return rolePermissions.includes(permission);
  };
  
  const getDefaultPermissionsForRole = (role) => {
    switch (role) {
      case "Admin":
        return [
          "manage_users", "view_all_records", "manage_appointments",
          "manage_settings", "generate_reports", "view_analytics"
        ];
      case "Veterinarian":
        return [
          "view_patient_records", "update_medical_records", 
          "manage_appointments", "view_own_schedule"
        ];
      case "Receptionist":
        return [
          "view_appointments", "schedule_appointments", 
          "register_patients", "view_patient_basic_info"
        ];
      case "Pet Owner":
        return [
          "view_own_pets", "view_own_appointments", 
          "book_appointments", "update_own_profile"
        ];
      default:
        return [];
    }
  };
