# roles/permissions.py
from rest_framework import permissions

class HasRoleBase(permissions.BasePermission):
    """
    Base permission class. We will inherit from this to create specific role checks.
    """
    required_role = None

    def has_permission(self, request, view):
        # 1. Check if the user is even logged in
        if not request.user or not request.user.is_authenticated:
            return False
            
        # 2. Check if the user has the required role attached to their account
        return request.user.roles.filter(name=self.required_role).exists()

# Now we define the specific roles based on the project requirements
class IsDetective(HasRoleBase):
    required_role = 'Detective' 

class IsCaptain(HasRoleBase):
    required_role = 'Captain'

class IsPoliceChief(HasRoleBase):
    required_role = 'Police Chief'

class IsCoroner(HasRoleBase):
    required_role = 'Coroner'

class IsSergeant(HasRoleBase):
    required_role = 'Sergeant'