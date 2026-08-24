from typing import List, Optional
from app.models import Project, ProjectClass, ProjectMemory, Message

class ContextBuilder:
    """
    Dynamically constructs LLM system and conversation context adhering to Requirement Section 7:
    Platform Rules -> Organization Rules -> Project Instructions -> Class Instructions -> Conversation Instructions -> Current User Request
    """

    @staticmethod
    def build_context(
        project: Project,
        memories: List[ProjectMemory],
        rag_chunks: List[str],
        recent_messages: List[Message],
        current_prompt: str,
        project_class: Optional[ProjectClass] = None
    ) -> tuple[str, str]:
        
        # 1. Platform & System Rules
        platform_rules = "Platform Rules: You are an enterprise AI Project Workspace agent. All access control, security policies, and user permissions are strictly enforced."
        sys_rules = getattr(project, "system_instructions", "You are an expert AI software architect and senior full-stack developer assistant.")
        dev_rules = getattr(project, "developer_rules", "1. Always write modular code.\n2. Provide clean diagrams in Mermaid format when requested.")
        
        # 2. Class-specific instructions if available
        class_str = ""
        if project_class:
            class_str = (
                f"\n=== WORKSTREAM CLASS: {project_class.name} ===\n"
                f"Assigned Specialist Agent: {project_class.assigned_agent}\n"
                f"Class Instructions: {project_class.instructions or 'N/A'}\n"
            )

        # 3. Dynamic Memory Block
        memory_str = ""
        if memories:
            memory_items = [f"- [{m.category.upper()}] {m.memory_key}: {m.memory_value}" for m in memories]
            memory_str = "\n=== PERSISTENT PROJECT MEMORY ===\n" + "\n".join(memory_items) + "\n"

        # 4. Dynamic RAG Files / Knowledge Chunks
        rag_str = ""
        if rag_chunks:
            rag_str = "\n=== RELEVANT PROJECT KNOWLEDGE (RAG) ===\n" + "\n".join([f"- {chunk}" for chunk in rag_chunks]) + "\n"

        # 5. Combine into final System Prompt following requirement order
        system_prompt = (
            f"=== 1. PLATFORM & SECURITY RULES ===\n{platform_rules}\n\n"
            f"=== 2. PROJECT INSTRUCTIONS ({project.name} | Public ID: {project.public_project_id}) ===\n"
            f"Phase: {project.current_phase}\n"
            f"Technologies: {', '.join(project.technologies or [])}\n"
            f"Instructions: {sys_rules}\n"
            f"Developer Rules: {dev_rules}\n"
            f"{class_str}"
            f"{memory_str}"
            f"{rag_str}\n"
            f"=== EXECUTION POLICY ===\n"
            f"Format all output with GitHub-flavored markdown. Use language tags on code blocks. Provide Mermaid diagrams for architecture designs."
        )

        # 6. Format Chat History
        history_str = ""
        if recent_messages:
            history_lines = []
            for msg in recent_messages[-10:]: # Limit to last 10 relevant messages
                history_lines.append(f"{msg.sender_name} ({msg.sender_type}): {msg.content}")
            history_str = "=== RECENT CONVERSATION HISTORY ===\n" + "\n".join(history_lines) + "\n\n"

        # 7. Final User Prompt
        full_user_prompt = f"{history_str}=== CURRENT DEVELOPER REQUEST ===\n{current_prompt}"

        return system_prompt, full_user_prompt
