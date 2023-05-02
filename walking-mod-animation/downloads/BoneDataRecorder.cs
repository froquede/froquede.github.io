using UnityEngine;
using System.IO;
using System.Collections.Generic;
using UnityEditor;

public class BoneDataRecorder : MonoBehaviour
{
    private Transform[] bones;
    private Dictionary<string, List<Vector3>> positions;
    private Dictionary<string, List<Quaternion>> rotations;
    public Animation anim;
    AnimationClip clip;
    public string anim_name;
    int frameCount = 0;
    int fps, totalFrames;
    Vector3 position = Vector3.zero;
    public bool anchorPelvis = false;

    void Start()
    {
        anim.Stop();
        clip = anim.clip;
        clip.wrapMode = WrapMode.Once;
        bones = GetComponentsInChildren<Transform>();
        positions = new Dictionary<string, List<Vector3>>();
        rotations = new Dictionary<string, List<Quaternion>>();
        totalFrames = (int)(clip.length * clip.frameRate);
        fps = (int)clip.frameRate;

        position = transform.position;

        foreach (Transform bone in bones)
        {
            positions.Add(bone.name, new List<Vector3>());
            rotations.Add(bone.name, new List<Quaternion>());
        }
    }

    int wait_count = 0;
    void FixedUpdate()
    {
        if (wait_count == 0) anim.Play(clip.name);
        if (wait_count == 12)
        {
            anim.Stop();
            anim.Rewind();
        }

        if (wait_count < 24)
        {
            wait_count++;
            return;
        }

        if (wait_count == 24)
        {
            anim.Rewind();
            anim.Play(clip.name);
            wait_count++;
        }

        if (!anim.IsPlaying(clip.name))
        {
            SaveData();
            UnityEditor.EditorApplication.isPlaying = false;
        }
        else
        {
            foreach (Transform bone in bones)
            {
                positions[bone.name].Add(bone.position);
                rotations[bone.name].Add(bone.rotation);
            }
            frameCount++;
        }
    }

    void Update()
    {
        if (anchorPelvis) transform.position = position;
    }

    void SaveData()
    {
        string folderPath = AssetDatabase.GetAssetPath(Selection.activeInstanceID);
        if (folderPath.Contains("."))
            folderPath = folderPath.Remove(folderPath.LastIndexOf('/'));

        Debug.Log(folderPath);

        using (StreamWriter writer = new StreamWriter(Path.Combine(folderPath, "Assets\\BoneData_" + anim_name + ".txt")))
        {
            foreach (string boneName in positions.Keys)
            {
                writer.WriteLine("##" + boneName);
                for (int i = 0; i < positions[boneName].Count; i++)
                {
                    Vector3 position = positions[boneName][i];
                    Quaternion rotation = rotations[boneName][i];
                    writer.WriteLine(position.x + "," + position.y + "," + position.z + "," + rotation.x + "," + rotation.y + "," + rotation.z + "," + rotation.w);
                }
            }
        }

        using (StreamWriter writer = new StreamWriter(Path.Combine(folderPath, "Assets\\BoneMeta_" + anim_name + ".txt")))
        {
            writer.WriteLine(anim_name);
            writer.Write(clip.length);
        }
    }
}